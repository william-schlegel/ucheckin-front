import gql from 'graphql-tag';
import { io } from 'socket.io-client';

import apolloClient from '../../apollo-client';
// import handlerSignal from './signal';

const querySignal = gql`
  query PLAY_UMIX_SIGNAL($token: String!, $signal: String!) {
    signals(
      where: {
        AND: [
          { name: { equals: $signal } }
          { owner: { tokens: { some: { token: { equals: $token } } } } }
        ]
      }
    ) {
      active
    }
  }
`;

const queryUmix = gql`
  query PLAY_UMIX_UMIX($token: String!, $macAddress: String!) {
    umixes(
      where: {
        AND: [
          { macAddress: { equals: $macAddress } }
          { owner: { tokens: { some: { token: { equals: $token } } } } }
        ]
      }
    ) {
      id
    }
  }
`;

console.log(`try to coinnect to server socket ${process.env.NEXT_PUBLIC_SERVER_UMIX}`);
const socket = io.connect(process.env.NEXT_PUBLIC_SERVER_UMIX);

export default function handler(req, res) {
  const body = req.body;
  const to = setTimeout(() => {
    if (!socket || !socket.connected)
      return res.status(500).json({ message: 'RT Socket server unreachable' });
  }, 3000);

  socket.on('connect', async () => {
    try {
      console.log(`socket connected to ${process.env.NEXT_PUBLIC_SERVER_UMIX}`);
      clearTimeout(to);
      console.log('body', body);
      if (!body.token) return res.status(400).json({ message: 'missing token' });
      if (!body.macAddress) return res.status(400).json({ message: 'missing macAddress' });
      if (!body.sigName) return res.status(400).json({ message: 'missing sigName' });
      if (!body.duration) return res.status(400).json({ message: 'missing duration' });
      if (!body.interval) return res.status(400).json({ message: 'missing interval' });
      if (!body.chanel) return res.status(400).json({ message: 'missing chanel' });

      const { token, macAddress, sigName, duration, interval, chanel } = body;
      if (isNaN(duration) || Number(duration) < 1 || Number(duration) > 60)
        return res
          .status(400)
          .json({ message: 'duration must be a number between 1 and 60 (seconds)' });

      if (isNaN(interval) || Number(interval) < 0 || Number(interval) > 3000)
        return res
          .status(400)
          .json({ message: 'interval must be a number between 0 and 3000 (miliseconds)' });
      if (isNaN(chanel) || Number(chanel) < 1 || Number(chanel) > 4)
        return res.status(400).json({ message: 'chanel must be a number between 1 and 4' });
      const CF = 17500 + (chanel - 1) * 1000;

      // chack signal validity
      const signals = await apolloClient.query({
        query: querySignal,
        variables: { token, signal: sigName },
      });
      console.log('signals', signals.data?.signals);
      if (!Array.isArray(signals.data?.signals) || !signals.data?.signals.length)
        return res.status(400).json({ message: `signal ${sigName} not found` });
      if (!signals.data?.signals[0].active)
        return res.status(400).json({ message: `signal ${sigName} is not active` });
      //  get umix id from mac address
      const umixes = await apolloClient.query({
        query: queryUmix,
        variables: { token, macAddress },
      });
      if (!Array.isArray(umixes.data?.umixes) || !umixes.data?.umixes.length)
        return res.status(400).json({ message: `umix ${macAddress} not found` });
      const umix = umixes.data?.umixes[0];
      console.log('umix', umix);

      // get signal url
      // handlerSignal(
      //   {
      //     query: {
      //       signal: sigName,
      //       FC: CF,
      //       interval: Number(interval),
      //       duration: Number(duration) / 1000,
      //       volume: 0.8,
      //       mode: 0,
      //       atom: 1,
      //     },
      //   },
      //   () => ({
      //     status: (n) => {
      //       console.log('status', n);
      //       return this;
      //     },
      //     json: (data) => {
      //       console.log('data', data);
      //     },
      //   })
      // );

      const searchString = new URLSearchParams({
        signal: sigName,
        FC: CF,
        interval: Number(interval),
        duration: Number(duration),
        volume: 0.8,
        mode: 0,
        atom: 1,
      }).toString();
      const server = `http://${req.headers.host}`;
      console.log('server', server);
      const resSig = await fetch(`${server}/api/signal?${searchString}`, { method: 'GET' });
      const { fileNameAtom } = await resSig.json();
      if (resSig.status !== 200)
        return res.status(500).json({ message: `error while creating signal ${sigName}` });
      console.log('fileNameAtom', fileNameAtom);

      socket.emit('ucheckin-play-now', {
        umixId: umix.id,
        url: fileNameAtom,
        duration,
        interval,
        sigName,
        centralFrequency: CF,
      });
      return res.status(200).json({ message: 'request sent to umix' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: `general error ${error}` });
    }
  });
}

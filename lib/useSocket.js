import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { useUser } from '../components/User/Queries';

const socket = io.connect(process.env.NEXT_PUBLIC_SERVER_UMIX);

socket.on('connect', () => {
  console.log(`socket connected to ${process.env.NEXT_PUBLIC_SERVER_UMIX}`);
});

const umixes = new Map();

export default function useSocket(myUmixId, onChange) {
  const { user } = useUser();
  const userId = user?.id;
  const [connectedUserId, setConnectedUserId] = useState('');

  useEffect(() => {
    if (userId && socket && socket.connected & !connectedUserId) {
      socket.once().emit('identification', { userId }, () => {
        // console.log(`${userId} connected to RT`);
        setConnectedUserId(userId);
        if (myUmixId) {
          socket.emit('get-umix-data', myUmixId, (data) => {
            // console.log(`${myUmixId} data received`, data);
            umixes.set(myUmixId, data);
            if (data?.umixId === myUmixId) {
              if (typeof onChange === 'function') onChange(data);
            }
          });
        }
      });
      socket.on('umix-data-update', (data) => {
        // console.log('umix data update', data);
        const umixId = data.umixId;
        const umix = umixes.get(umixId);
        umixes.set(umixId, { ...umix, ...data });
        if (umixId === myUmixId) {
          if (typeof onChange === 'function') onChange(data);
        }
      });
    }
  }, [userId, myUmixId, onChange, connectedUserId]);

  function getUmixData(umixId) {
    return umixes.get(umixId);
  }

  return { socket, isConnected: socket?.connected, connectedUserId, getUmixData };
}

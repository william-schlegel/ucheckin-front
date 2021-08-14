import AWS from 'aws-sdk';
import { WaveFile } from 'wavefile';

/* eslint-disable no-bitwise */

export default function handler(req, res) {
  const { signal } = req.query; // code à créer
  const fc = Number(req.query.fc || 19500); // fréquence centrale
  const interval = Number(req.query.interval || 500); // interval entre 2 signaux (en ms)
  const duration = Number(req.query.duration || 30); // durée totale du signal
  const volume = Number(req.query.volume || 0.8); // gain à appliquer (entre 0 et 1)
  const mode = Number(req.query.mode || 0); // mode (0 pour ucheckin, 1 pour wi-us - pas encore implémenté)

  if (mode === 0) {
    if (signal.length !== 5)
      return res
        .status(400)
        .json({ error: `Signal ${volume} must have 5 hex characters` });
    if (volume > 1)
      return res
        .status(400)
        .json({ error: `Volume ${volume} must be between 0 and 1` });
  } else {
    return res.status(400).json({ error: `mode ${mode} not implemented yet` });
  }

  const B = 1000; // largeur de bande
  const T = 1024; // temps symbole
  const fe = 48000; // fréquence d'échantillonnage

  const tLg = parseInt(4 * T); // temps du chirp long
  const bitPerSymb = 4; // nombre de bits par symbole (ucheckin)
  const charPerMess = 5; // caractères par message (ucheckin)
  const nbUsefulBits = bitPerSymb * charPerMess;
  // table d'encodge des caractères (left et right concaténées)
  const table =
    '11001110000100110101011110011011110111110000001001000110100010100001001101101000101011001110000000100100010101111001101111011111';
  const wavParam = 32767;
  const paramAlpha = 0.5; // paramètre alpha de la fenêtre de tukey
  const hammingAdds = [4, 8]; // bits de parité supplémentaires pour détection d'erreur hamming

  /**
   * Convert an hexadecimal string into an integer
   * @param {String} sourceH hexa to convert
   * @returns {Number} converted integer
   */
  function hexaToInt(sourceH) {
    return parseInt(sourceH, 16);
  }

  /**
   * Convert an integer into a hexadecimal string
   * @param {Number} source_i number to convert
   */
  // function intToHexa(sourceI) {
  //   return sourceI.toString(16).toUpperCase();
  // }

  /**
   * Compute the number of parity bits needed
   * @return {Number} number of parity bits needed for m useful bits
   */
  function parityBitsCompute() {
    let r = 0;
    for (let i = 0; i < nbUsefulBits; i += 1)
      if (2 ** i >= nbUsefulBits + i + 1) {
        r = i;
        break;
      }
    // console.log(`parityBitsCompute`, r);
    return r;
  }

  /**
   * Encode a sequence of bit with extended hamming error detection
   * @param {String} data int to convert
   * @returns {Array} [list: useful bit and parity bits, int: total number of parity bits]
   */
  function hammingEncode(data) {
    let j = 0;
    let k = 0;
    const r = parityBitsCompute();
    const result = [];
    for (let i = 0; i < nbUsefulBits + r; i += 1) {
      if (i + 1 === 2 ** j) {
        result.push(0);
        j += 1;
      } else {
        result.push(data[k]);
        k += 1;
      }
    }
    // console.log(`res1`, result);
    const n = result.length;
    for (let i = 0; i < r; i += 1) {
      let val = 0;
      for (let ii = 0; ii < n; ii += 1)
        if (((ii + 1) & (2 ** i)) === 2 ** i)
          val = parseInt(val, 10) ^ parseInt(result[ii], 10);
      result[2 ** i - 1] = val;
    }
    // console.log(`res2`, result);
    for (const occu of hammingAdds) {
      let val = 0;
      for (let i = 0; i < n; i += occu) {
        val = parseInt(val, 10) ^ parseInt(result[i], 10);
      }
      result.push(val);
    }
    // console.log(`res3`, result);
    const nbPbits = r + hammingAdds.length;
    return [result, nbPbits];
  }

  /**
   * Slice a pattern into a list of 0 and 1 for conversion
   * @param {Number} num pattern from conversion table to slice
   * @returns sliced bits
   */
  function sliceNum(num) {
    const ret = num.split('').map((n) => Number(n));
    // console.log(`sliceNum`, ret);
    return ret;
    // res = [num // 10**3 %10, num // 10**2 %10, num // 10**1 %10, num // 10**0 %10]
    // return res
  }

  /**
   * Encode an hexadecimal message into a sequence of bits
   * @param {String} code Message to convert (in hexadecimal)
   * @return {Array} converted bits
   */
  function encodeMessage(code) {
    const l = code.length;
    const half = (l % 2 ? l + 1 : l + 2) / 2;
    const arr = code.split('').reduce((acc, digit, index) => {
      const value = hexaToInt(digit);
      const offset = index < half ? 0 : 64;
      const bits = table.slice(offset + 4 * value, offset + 4 * (value + 1));
      acc.push(sliceNum(bits));
      return acc;
    }, []);
    // console.log(`arr`, arr.flat());
    const resHamming = hammingEncode(arr.flat());
    // console.log(`resHamming`, resHamming);
    return resHamming;
  }

  /**
   * Create a tuckey winndow
   * @param {Number} nbSamples window length
   * @returns {Array}
   */
  function tukeyWindow(nbSamples) {
    const di = parseInt(Math.ceil(nbSamples * paramAlpha));
    // console.log(`di`, di);
    const hannWin = [];
    for (let i = 0; i < di; i += 1) {
      const nv = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (di - 1)));
      hannWin.push(nv);
      // if (i > 500 && i < 550) console.log(`nv (${i})`, nv);
    }
    // console.log(`hannWin`, hannWin);
    const lim = parseInt(Math.ceil(di / 2));
    const tukeyWin = [];
    for (let i = 0; i < lim; i += 1) tukeyWin.push(hannWin[i]);
    for (let i = lim; i < nbSamples - lim; i += 1) tukeyWin.push(1);
    for (let i = 0; i < lim; i += 1) tukeyWin.push(hannWin[lim + i]);
    // console.log(`tukeyWin`, tukeyWin);
    return tukeyWin;
  }

  /**
   * Create a chirp
   * @param {Boolean} isUp chirp up
   * @param {Number} dur duration
   * @returns {Array} Chirp values
   */
  function oneShot(isUp, dur) {
    const wc = (fc * 2 * Math.PI) / fe;
    // console.log(`wc`, wc);
    const bRad = (B * 2 * Math.PI) / fe;
    // console.log(`bRad`, bRad);
    const chirp = [];
    let phase = 0.0;
    const slope = isUp ? 1 : -1;
    for (let i = 0; i < dur; i += 1) {
      const nv = Math.sin(phase);
      chirp.push(nv);
      phase += ((slope * bRad) / dur) * (i + 0.5 * (1 - dur)) + wc;
    }
    // console.log(`chirp`, chirp);
    const env = tukeyWindow(dur);
    let max = 0;
    for (let i = 0; i < dur; i += 1) {
      const nv = chirp[i] * env[i];
      if (Number.isNaN(nv)) console.log(i, env[i], chirp[i]);
      chirp[i] = nv;
      if (chirp[i] > max) max = chirp[i];
    }
    if (max > 0)
      for (let i = 0; i < dur; i += 1) {
        chirp[i] /= max;
        // if (i >= 300 && i < 350) console.log(`chirp[${i}]`, chirp[i]);
      }
    return chirp;
  }

  /**
   * Create a signal of chirps, with a synchronisation symbol, regarding a sequence of bits
   * @param {Array} messageBits Array of bits to encode
   * @return {Array} buffer of the signal
   */
  function createSignal(messageBits) {
    const bufLongChirp = oneShot(true, tLg);
    const bufLowChirp = oneShot(false, T);
    const bufHighChirp = oneShot(true, T);
    // start with blanck
    const bufferSig = new Array(T).fill(0);
    bufferSig.push(...bufLongChirp);
    for (const bit of messageBits) {
      if (bit) bufferSig.push(...bufHighChirp);
      else bufferSig.push(...bufLowChirp);
    }
    return bufferSig;
  }

  /**
   * Save a buffer on S3 bucket
   * @param {Array} bufferSignal Buffer of th signal to save
   * @returns {String} url of the signal
   */
  function saveFile(bufferSignal) {
    const wav = new WaveFile();
    const credentials = new AWS.Credentials({
      accessKeyId: process.env.NEXT_AWS_ID,
      secretAccessKey: process.env.NEXT_AWS_SECRET,
    });
    const s3 = new AWS.S3({
      credentials,
    });
    // const buffer = Buffer.from(bufferSignal);
    wav.fromScratch(1, fe, '16', bufferSignal);
    const params = {
      Bucket: process.env.NEXT_AWS_BUCKET,
      Key: `${signal}_${fc}_${duration}.wav`,
      Body: Buffer.from(wav.toBuffer()),
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log(`err`, err);
          reject(err);
        } else {
          resolve({ url: data.Location, fileName: params.Key });
        }
      });
    });
  }

  if (mode === 0) {
    console.log(`signal`, signal);
    const encoded = encodeMessage(signal);
    const buffSignal = createSignal(encoded[0]);
    const intervSpl = parseInt((interval / 1000) * fe);
    const blank = new Array(intervSpl).fill(0);

    const lg1Sig = (buffSignal.length + blank.length) / fe;
    const repeat = Math.floor(duration / lg1Sig);
    const signalComplet = [];
    for (let i = 0; i < repeat; i += 1) {
      signalComplet.push(...buffSignal, ...blank);
    }
    let max = 0;
    for (let i = 0; i < signalComplet.length; i += 1) {
      const v = Math.abs(signalComplet[i]);
      if (v > max) max = v;
    }

    for (let i = 0; i < signalComplet.length; i += 1) {
      signalComplet[i] = parseInt(
        ((signalComplet[i] * volume) / max) * wavParam,
        10
      );
    }
    return saveFile(signalComplet).then(({ url, fileName }) =>
      res.status(200).json({ url, fileName })
    );
  }
  return res.status(400).json({ error: 'mode 1 not implemented yet' });
}

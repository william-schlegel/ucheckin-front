// import Fili from "fili";
import Fft from "./fft";

// const iirCalculator = new Fili.CalcCascades();

const BUFFER_LENGTH = 2048;
const MAX_VALUE = 20000;
// coefficients pour le filtre de Butterworth d'ordre 5 en FC = 5MHz et FE = 100MHz
const COEFFS = [
  {
    fir: [5.97957804e-5, 1.19591561e-4, 5.97957804e-5],
    iir: [1.0, -1.57683109, 7.08501861e-1],
  },
  { fir: [1.0, 2.0, 1.0], iir: [1.0, -1.66250775, 7.26542528e-1] },
  { fir: [1.0, 0.0, -1.0], iir: [1.0, -1.81424532, 8.46857338e-1] },
  { fir: [1.0, -2.0, 1.0], iir: [1.0, -1.67175849, 8.68290217e-1] },
  { fir: [1.0, -2.0, 1.0], iir: [1.0, -1.92597775, 9.509085e-1] },
];
const ORDER = COEFFS.length;

function butterworthFilter(buff, fc, fe) {
  console.log("BUTTERWORTH");
  const coeffs = COEFFS; //coeffsButter(fc, fe);
  const accInput = new Array(ORDER).fill(0);
  const accOutput = new Array(ORDER).fill(0);
  const buffer1 = new Array(ORDER).fill(0);
  const buffer2 = new Array(ORDER).fill(0);
  const res = new Array(BUFFER_LENGTH).fill(0);
  for (let j = 0; j < BUFFER_LENGTH; j++) {
    const dataCpy = buff[j];
    for (let i = 0; i < ORDER; i++) {
      accInput[i] =
        dataCpy +
        buffer1[i] * -coeffs[i].iir[1] +
        buffer2[i] * -coeffs[i].iir[2];
      accOutput[i] =
        accInput[i] * coeffs[i].fir[0] +
        buffer1[i] * coeffs[i].fir[1] +
        buffer2[i] * coeffs[i].fir[2];
      buffer2[i] = buffer1[i];
      buffer1[i] = accInput[i];
      dataCpy = accOutput[i];
    }
    res[j] = accOutput[ORDER - 1];
  }
  return res;
}

function hilbert(buff) {
  console.log("HILBERT");
  // crée un objet fft
  const fft = new Fft(BUFFER_LENGTH);
  // pousse les valeurs, pas de fenêtrage
  const buffFft = fft.forward(buff, "none");
  // porte Hilbert
  const h = new Array(BUFFER_LENGTH).fill(0);
  h[0] = 1;
  h.fill(2, 1, BUFFER_LENGTH / 2);
  h[BUFFER_LENGTH / 2] = 1;
  // console.log(`h`, h);
  // multiplication terme à terme
  for (let i = 0; i < BUFFER_LENGTH; i++) {
    buffFft.im[i] *= h[i];
    buffFft.re[i] *= h[i];
  }
  const newBuff = fft.inverse(buffFft.re, buffFft.im);
  const absBuff = newBuff.map((v) => Math.abs(v));
  // console.log(`absBuff`, absBuff);
  return absBuff;
}

/**
 * Normalise le tableau de valeurs en interpollant les valeurs manquantes et en supprimant les erreurs
 * @param {Array} buff Tabeau des valeurs
 * @returns tableau néttoyé
 */
function cleanup(buff) {
  const cleanBuff = new Array(BUFFER_LENGTH).fill(0);
  const step = parseFloat(BUFFER_LENGTH) / parseFloat(buff.length);
  console.log("step", step);
  let adjust = 0;
  for (let i = 0; i < buff.length; i++) {
    const id = Math.floor(parseFloat(i) * step);
    cleanBuff[id] = buff[i];
  }
  // console.log(`buff`, cleanBuff.slice(0, 100));
  for (let i = 1; i < BUFFER_LENGTH; i++) {
    if (cleanBuff[i] > MAX_VALUE || cleanBuff[i] === 0) {
      adjust++;
      const v1 = cleanBuff[i - 1];
      const v2 = cleanBuff[i + 1] || v1;
      cleanBuff[i] = Math.round((v1 + v2) / 2);
    }
  }
  // console.log(`cleanBuff`, cleanBuff.slice(0, 100));
  console.log(`adjust`, adjust);
  return cleanBuff;
}

/**
 * Fonction principale de transformation du tableau de points en courbe pour A-Scan
 * @param {Array} buff Valeurs (2048)
 * @param {Number} fc Fréquence centrale du sensor (défaut 5MHz)
 * @param {Number} fe Fréquence d'échantillonnage (défaut 100MHz)
 * @returns Tableau de la courbe
 */
export function calculCourbe(buff, fc = 5e6, fe = 1e8) {
  console.log("calcul courbe", { fc, fe });
  const cleanBuff = cleanup(buff);
  const buffFilter = butterworthFilter(cleanBuff, fc, fe);
  const buffHilbert = hilbert(buffFilter);
  // converti en array d'int à partir de float64
  const result = new Array(BUFFER_LENGTH);
  for (let r = 0; r < BUFFER_LENGTH; r++) result[r] = parseInt(buffHilbert[r]);
  return result;
}

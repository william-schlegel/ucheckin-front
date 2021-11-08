import { useEffect, useRef } from 'react';
// import useSize from '../../lib/useSize';

const ID_CANVAS = 'canvas-courbe';

const getIdMax = (points) => {
  let max = 0;
  let id = 0;
  for (let p = 0; p < points.length; p++) {
    if (points[p] > max) {
      max = points[p];
      id = p;
    }
  }
  return id;
};

export default function DessinCourbe({
  points,
  dataMesure,
  freqEchMHz = 100,
  handlePics = (picA, picB) => {
    return { picA, picB };
  },
}) {
  // const dim = useSize(ref);

  const dim = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const el = document.getElementById(ID_CANVAS);
    console.log(`el`, el);
    if (!el) return;
    const w = el.parentElement.clientWidth - 28;
    dim.current.width = parseInt(w);
    dim.current.height = parseInt(w * 0.66);
    console.log(`dim`, dim.current);
  }, []);

  const handleCanvas = (canvas) => {
    if (!points.length) return;
    if (!canvas) return;

    canvas.width = dim.current.width;
    canvas.height = dim.current.height;
    const offsetX = 5;
    const offsetY = 25;
    const maxPoints = Math.max(...points);
    const h = canvas.height;
    const w = canvas.width;
    const dHor = (w - offsetX * 2) / points.length;
    const dVert = (h - offsetY * 2) / maxPoints;
    const totalµs = points.length / freqEchMHz;
    const dox = 2;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'grey';
    ctx.strokeRect(0, 0, canvas.width - 1, canvas.height);

    const drawPorte = (debut, largeur, seuil, couleur) => {
      // porte
      ctx.beginPath();
      // id dans le tableau de points
      const idDeb = (debut / totalµs) * points.length;
      const idFin = ((debut + largeur) / totalµs) * points.length;
      const subPoints = points.slice(idDeb, idFin);
      const pic = getIdMax(subPoints);
      const offset = h - offsetY - (seuil * h) / 100;
      ctx.moveTo(offsetX + idDeb * dHor, offset);
      ctx.lineTo(offsetX + idFin * dHor, offset);
      ctx.strokeStyle = couleur;
      ctx.setLineDash([]);
      ctx.stroke();
      // pic
      ctx.beginPath();
      ctx.moveTo(offsetX + (idDeb + pic) * dHor, h - offsetY);
      ctx.lineTo(offsetX + (idDeb + pic) * dHor, 0);
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      return idDeb + pic;
    };

    // courbe
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#888';
    const ix = Math.floor(points.length / w);
    ctx.moveTo(offsetX, h - offsetY);
    for (let p = 1; p < points.length; p += ix) {
      const pp = points[p];
      ctx.lineTo(offsetX + p * dHor, h - offsetY - pp * dVert);
    }
    ctx.stroke();
    // echelle
    ctx.beginPath();
    ctx.strokeStyle = 'gray';
    ctx.moveTo(offsetX, h - offsetY + dox);
    ctx.lineTo(w - offsetX, h - offsetY + dox);
    for (let p = 0; p <= 10; p += 1) {
      ctx.moveTo(offsetX + p * ((w - offsetX) / 10), h - offsetY + 5 + dox);
      ctx.lineTo(offsetX + p * ((w - offsetX) / 10), h - offsetY + dox);
    }
    let ech = 0;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'gray';
    for (let p = 0; p <= 10; p += 1) {
      ctx.fillText(ech === 0 ? '(µs)' : Math.round(ech), offsetX - 4 + p * (w / 10), h - 10);
      ech += totalµs / 10;
    }
    ctx.stroke();
    const picA = drawPorte(dataMesure.startA, dataMesure.widthA, dataMesure.thresholdA, 'red');
    const picB = drawPorte(dataMesure.startB, dataMesure.widthB, dataMesure.thresholdB, 'blue');
    handlePics(picA, picB);
  };

  return (
    <div id={ID_CANVAS}>
      <canvas ref={handleCanvas} />
    </div>
  );
}

const canvas = {
  main: document.getElementById('canvas--main'),
  tilesheet: document.getElementById('canvas--tilesheet'),
  onResizeCallbacks: [],
}
const ctx = {
  main: canvas.main.getContext('2d'),
  tilesheet: canvas.tilesheet.getContext('2d'),
}

function resize() {
  const leftDiv = document.getElementById('left-content').getBoundingClientRect();
  const centerDiv = document.getElementById('center-content').getBoundingClientRect();
  const rightDiv = document.getElementById('right-content').getBoundingClientRect();
  canvas.main.width = centerDiv.width;
  canvas.main.height = centerDiv.height;

  canvas.tilesheet.width = rightDiv.width * 0.9;
  canvas.tilesheet.height = rightDiv.width * 1.2;
}

resize();
window.onresize = event => {
  resize();
  canvas.onResizeCallbacks.forEach(callback => {
    callback(canvas, event);
  });
}

export default function setupCanvas() {
  return {
    canvas: canvas,
    ctx: ctx
  }
}

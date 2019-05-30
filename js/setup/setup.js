import setupCanvas from './canvas.js';
import setupTilesheet from './tilesheet.js';
import setupMouse from './mouse.js';
import setupPaintbrush from './paintbrush.js';

export default function setup() {
  return {
    canvas: setupCanvas,
    tilesheet: setupTilesheet,
    mouse: setupMouse,
    paintbrush: setupPaintbrush
  }
}
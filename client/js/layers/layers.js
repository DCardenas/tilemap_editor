import Vector2 from '../math/Vector2.js';
import createMainCanvasLayers from './canvas/main.js';
import createTilesheetCanvasLayers from './canvas/tilesheet.js';

export default function createLayers(canvas, settings, mouse, tsManager, level, paintbrush) {
  const result = new Map();
  ['main', 'tilesheet', 'layer'].forEach(type => {
    result.set(type, []);
  });
  
  createMainCanvasLayers(canvas.main, settings, mouse, tsManager, level, paintbrush).forEach(layer => {
    result.get('main').push(layer);
  });
  createTilesheetCanvasLayers(canvas.tilesheet, mouse, tsManager).forEach(layer => {
    result.get('tilesheet').push(layer);
  });
  
  return result;
}

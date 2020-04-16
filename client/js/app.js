import Compositor from './layers/Compositor.js';
import MouseManager from './inputs/MouseManager.js';
import KeyManager from './inputs/KeyManager.js';
import Settings from './settings/Settings.js';
import Camera from './Camera.js';
import setup from './setup/setup.js';
import createLayers from './layers/layers.js';
import Matrix from './math/Matrix.js';
import Level from './level/Level.js';
import FileIO from './loaders/FileIO.js';

import Vector2 from './math/Vector2.js';

let DRAW_MODE = 'draw';
let TRIGGER_MODE = 'trigger';

const init = setup();
const canvas = init.canvas().canvas;
let canvasMode = DRAW_MODE;
const ctx = init.canvas().ctx;
const tilesheetManager = init.tilesheet();
canvas.onResizeCallbacks.push(function(canvas, event) {
  tilesheetManager.setRatios(canvas.tilesheet, event);
});
const settings = new Settings();
const comp = new Compositor();
const camera = {
  main: new Camera(),
  tilesheet: new Camera()
}

const level = new Level();
document.getElementById('button--clear').onclick = event => {
  level.clearLayer();
}
settings.addCanvasSizeCallback(size => {
  level.cols = size.x;
  level.rows = size.y;

  level.redraw = true;
});
settings.addTileSizeCallback(size => {
  level.redraw = true;
});

const mouse = init.mouse(canvas, camera, tilesheetManager);
const paintbrush = init.paintbrush(mouse, level, canvas.main, settings, camera.main, tilesheetManager);

mouse.addCallback('wheel', event => {
  // Forward -100, Backward 100
  const scale = event.deltaY * -0.02;
  const targetID = event.target.getAttribute('id');
  if (targetID === canvas.main.getAttribute('id')) {
    settings.changeZoom(scale);
  } else if (targetID === canvas.tilesheet.getAttribute('id')) {
    tilesheetManager.changeZoom(scale);
  }
});

const keys = new KeyManager();
keys.listenTo(window, 'keydown');
keys.listenTo(window, 'keyup');
keys.addCallback('keyup', event => {
  if (event.key === 'Escape') {
    tilesheetManager.clearSelection();
    paintbrush.currentSelection = null;
  }
});

const layers = createLayers(canvas, settings, mouse, tilesheetManager, level, paintbrush);
['main', 'tilesheet', 'layer'].forEach(group => {
  comp.addLayerGroup(group);
});

layers.forEach((layerArray, name) => {
  layerArray.forEach(layer => {
    comp.addLayer(name, layer);
  });
});

const fileIO = new FileIO(tilesheetManager, level, settings);
let last = performance.now();
function loop() {
  const now = performance.now();

  if (!mouse.isIdle && document.getElementById('overlay').style.visibility === 'hidden') {
    if (mouse.idle < mouse.idleCD) {
      mouse.idle += now - last;
    } else {
      mouse.isIdle = true;
    }
  }

  if (settings.zoom != settings.targetZoom) {
    settings.updateZoom();
  }

  camera.main.update();

  comp.draw(ctx, camera, settings);

  last = now;
  window.requestAnimationFrame(loop);
}

loop();

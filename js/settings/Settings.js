import Vector2 from '../math/Vector2.js';

export default class Settings {
  constructor() {
    this.dims = {
      tile: new Vector2(32, 32),
      canvas: new Vector2(40, 30)
    };
    this.zoom = 1;
    this.margin = new Vector2();
    this.redraw = {
      main: true,
      tilesheet: true,
      layers: true
    };
    this.onTileSizeChange = [];
    this.onCanvasSizeChange = [];
    this.onZoomChange = [];
    
    ['tile-width', 'tile-height'].forEach(id => {
      const div = document.getElementById(id);
      div.onchange = this.updateTileSize.bind(this);
    });
    ['canvas-cols', 'canvas-rows'].forEach(id => {
      const div = document.getElementById(id);
      div.onchange = this.updateCanvasSize.bind(this);
    });
    document.getElementById('canvas-grid').onchange => {
      this.toggleGrid();
    }
  }  
  
  addTileSizeCallback(callback) {
    this.onTileSizeChange.push(callback);
  }
  
  addCanvasSizeCallback(callback) {
    this.onCanvasSizeChange.push(callback);
  }
  
  addZoomCallback(callback) {
    this.onZoomChange.push(callback);
  }
  
  updateTileSize() {
    const divWidth = document.getElementById('tile-width');
    const divHeight = document.getElementById('tile-height');
    
    let width = parseInt(divWidth.value) * this.zoom;
    let height = parseInt(divHeight.value) * this.zoom;

    let max = 512;

    if (width == '') {
      width = 8;
      divWidth.value = 8;
    } else if (width > max) {
      width = max;
      divWidth.value = max;    
    }

    if (height == '') {
      height = 8;
      divHeight.value = 8;
    } else if (height > max) {
      height = max;
      divHeight.value = max;    
    }

    this.dims.tile.set(width, height);
    
    this.onTileSizeChange.forEach(callback => {callback(this.dims.tile)});
    this.redraw.main = true;
  }
  
  updateCanvasSize() {
    const divWidth = document.getElementById('canvas-cols');
    const divHeight = document.getElementById('canvas-rows');

    let width = divWidth.value;
    let height = divHeight.value;

    let min = 1;
    let max = 100;

    if (width == '') {
      width = min;
      divWidth.value = min;
    } else if (width > max) {
      width = max;
      divWidth.value = max;    
    }

    if (height == '') {
      height = min;
      divHeight.value = min;
    } else if (height > max) {
      height = max;
      divHeight.value = max;    
    }

    this.dims.canvas.set(width, height);
    
    this.onCanvasSizeChange.forEach(callback => {callback(this.dims.canvas)});
    this.redraw.main = true;
  }
  
  changeZoom(dz) {
    this.zoom += dz;
    this.zoom = Math.min(Math.max(this.zoom, 0.2), 3);
    this.updateTileSize();
  }
  
  toJSON() {
    const result = {};
    result.dims = this.dims;
    result.margin = this.margin;
    return result;
  }
}

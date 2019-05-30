import Matrix from '../math/Matrix.js';
import Sprite from '../sprites/Sprite.js';

class Layer {
  constructor(name) {
    this.name = name;
    this.tiles = new Matrix();
    this.visible = true;
  }
  
  empty() {
    this.tiles.empty();
  }
  
  toggleVisible() {
    this.visible = !this.visible;
  }
  
  setTile(sprite, col, row) {
    this.tiles.set(sprite, col, row);
  }
  
  getTile(col, row) {    
    return this.tiles.get(col, row);
  }
  
  toJSON() {
    const result = {};
    result.name = this.name;
    result.tiles = [];
    this.tiles.forEach((sprite, col, row) => {
      if (!sprite) {
        return;
      }
      
      const spriteData = sprite.toJSON();
      if (spriteData) {
        const spriteResult = {};
        spriteResult.col = col;
        spriteResult.row = row;
        spriteResult.sprite = spriteData;
        result.tiles.push(spriteResult);
      }
    });
    return result;
  }
}

export default class Level {
  constructor() {
    this.layers = new Map();
    this.activeLayer = null;
    this.addLayer(new Layer('background'));
    this.addLayer(new Layer('bg-2'));
    this.setLayer('background');
    
    this.cols = parseInt(document.getElementById('canvas-cols').value);
    this.rows = parseInt(document.getElementById('canvas-rows').value);
    
    this.redraw = false;
  }
  
  has(col, row) {
    return this.hasCol(col) && this.hasRow(row);
  }
  
  hasCol(col) {
    return 0 <= col && col < this.cols;
  }
  
  hasRow(row) {
    return 0 <= row && row < this.rows;
  }
  
  addLayer(layer) {
    this.layers.set(layer.name, layer);
    
    const div = document.createElement('div');
    div.name = layer.name;
    div.className = 'layer-block layer-block-inactive';
    div.setAttribute('id', layer.name);
    
    const layerName = document.createElement('div');
    layerName.innerHTML = layer.name;
    layerName.className = 'layer-name';
    layerName.onclick = event => {
      this.setLayer(layer.name);
    }
    
    const options = document.createElement('div');
    options.className = 'layer-options';
    
    const visible = document.createElement('button');
    visible.onclick = event => {
      layer.toggleVisible();
      
      visible.className = 'button--layer-block button--layer-block-active';
      
      if (!layer.visible) {
        visible.className = 'button--layer-block button--layer-block-inactive';
      }
      
      this.redraw = true;
    }
    visible.innerHTML = 'v';
    visible.className = 'button--layer-block button--layer-block-active';
    
    layer.div = div;
    
    div.appendChild(layerName);
    div.appendChild(options);
    options.appendChild(visible);
    document.getElementById('layers').appendChild(div);
  }
  
  setLayer(name) {
    if (this.activeLayer) {
      this.activeLayer.div.className = 'layer-block layer-block-inactive';
    }
    
    const layer = this.layers.get(name);
    
    if (!layer) {
      console.log('Could not find layer with name ' + name);
      return;
    }
    
    layer.div.className = 'layer-block layer-block-active';
    
    this.activeLayer = layer;
  }
  
  clearLayer() {
    this.activeLayer.empty();
    this.redraw = true;
  }
  
  setTile(sprite, col, row) {
    this.activeLayer.setTile(sprite, col, row);
  }
  
  getTile(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return null;
    }
    
    if(!this.activeLayer.getTile(col, row)) {
      this.activeLayer.setTile(null, col, row);
    }
    
    return this.activeLayer.getTile(col, row);
  }
  
  toJSON() {
    const result = {};
    
    result.cols = this.cols;
    result.rows = this.rows;
    result.layers = {};
    
    this.layers.forEach(layer => {
      result.layers[layer.name] = layer.toJSON();
    });
    
    return result;
  }
}
import Matrix from '../math/Matrix.js';
import Sprite from '../sprites/Sprite.js';
import createNewLayerOverlay from '../overlays/create-layer.js';
import removeLayerOverlay from '../overlays/remove-layer.js';

class Layer {
  constructor(name) {
    this.name = name;
    this.tiles = new Matrix();
    this.visible = true;
    this.bgColor = 'white';
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
    this.cols = parseInt(document.getElementById('canvas-cols').value);
    this.rows = parseInt(document.getElementById('canvas-rows').value);

    this.addLayerButton = document.getElementById('new-layer');
    this.removeLayerButton = document.getElementById('del-layer');

    this.colorButton = document.getElementById('input--settings-color');

    this.setupButtons();
    this.addLayer(new Layer('background'));
    this.setLayer('background');

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

  setupButtons() {
    const overlayDiv = document.getElementById('overlay');
    const overlayContainerDiv = document.getElementById('overlay-container');

    this.addLayerButton.onclick = event => {
      const overlay = createNewLayerOverlay();
      overlayContainerDiv.innerHTML = overlay;

      overlayDiv.style.visibility = 'visible';

      const nameDiv = document.getElementById('overlay-name');
      const createButton = document.getElementById('button--layer-create');

      nameDiv.onkeyup = event => {
        if (nameDiv.value.length > 0) {
          createButton.className = 'button--active';
        } else {
          createButton.className = 'button--inactive';
        }
      }

      createButton.onclick = event => {
        if (createButton.className == 'button--active') {
          overlayDiv.style.visibility = 'hidden';
          const layer = new Layer(nameDiv.value);
          this.addLayer(layer);
        } else {
          console.log('Layer must have a name!');
        }
      }

      document.getElementById('button--layer-cancel').onclick = event => {
        overlayDiv.style.visibility = 'hidden';
      }
    }
    this.removeLayerButton.onclick = event => {
      if (this.removeLayerButton.className === 'button--inactive button--layer') {
        return;
      }

      const overlay = removeLayerOverlay();
      overlayContainerDiv.innerHTML = overlay;

      overlayDiv.style.visibility = 'visible';

      document.getElementById('button--layer-confirm').onclick = event => {
        overlayDiv.style.visibility = 'hidden';
        this.removeCurrentLayer();
      }

      document.getElementById('button--layer-cancel').onclick = event => {
        overlayDiv.style.visibility = 'hidden';
      }
    }

    this.colorButton.onclick = event => {
      this.colorButton.jscolor.onFineChange = event => {
        this.activeLayer.bgColor = this.colorButton.jscolor.toRGBString();
        this.redraw = true;
      }
    }
  }

  addLayer(layer) {
    this.layers.set(layer.name, layer);

    if (this.layers.size > 1) {
      this.removeLayerButton.className = 'button--active button--layer';
    }

    const div = document.createElement('div');
    div.id = layer.id;
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

    const image = new Image();
    image.src = '../client/images/eye-open.png';
    image.width =  30;
    image.height = 30;
    const visible = document.createElement('button');
    visible.onclick = event => {
      layer.toggleVisible();

      visible.className = 'button--layer-block button--layer-block-active';
      image.src = '../client/images/eye-open.png';

      if (!layer.visible) {
        visible.className = 'button--layer-block button--layer-block-inactive';
        image.src = '../client/images/eye-closed.png';
      }

      this.redraw = true;
    }
    visible.className = 'button--layer-block button--layer-block-active';
    visible.appendChild(image);

    layer.div = div;

    div.appendChild(layerName);
    div.appendChild(options);
    options.appendChild(visible);
    document.getElementById('layers').appendChild(div);
    this.setLayer(layer.name);
  }

  removeCurrentLayer() {
    if (this.layers.size > 1) {
      const div = document.getElementById(this.activeLayer.name);
      document.getElementById('layers').removeChild(div);

      this.layers.delete(this.activeLayer.name);
      const bgLayer = this.layers.values().next().value;
      this.setLayer(bgLayer.name);

      if (this.layers.size === 1) {
        this.removeLayerButton.className = 'button--inactive button--layer';
      }
    }
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

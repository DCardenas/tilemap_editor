import Sprite from './Sprite.js';
import Vector2 from '../math/Vector2.js';
import Matrix from '../math/Matrix.js';
import Selection from '../paintbrush/Selection.js';

export class TilesheetManager {
  constructor() {
    this.tilesheets = new Map();
    this.activeSheet = null;
    this.activeTiles = new Matrix();
    this.tileSelection = null;
    this.selecting = false;
    this.onTileSheetChange = [];
    this.display = null;
    this.zoom = 1;
    this.sheets = 0;
  }

  get hasTile() {
    return !this.activeTiles.isEmpty;
  }

  clearSelection() {
    this.activeTiles.empty();
    this.tileSelection = null;
  }

  setRatios(canvas, event) {
    if (!this.activeSheet) {
      return;
    }

    this.tilesheets.forEach(tilesheet => {
      tilesheet.setRatio(canvas, event);
    });

    this.activeSheet.redraw = true;
  }

  addCallback(callback) {
    this.onTileSheetChange.push(callback);
  }

  handleChange() {
    if (!this.activeSheet) {
      return;
    }
  }

  addTilesheet(tilesheet) {
    this.tilesheets.set(tilesheet.name, tilesheet);
    this.setActiveSheet(tilesheet.name);
    this.sheets += 1;
  }

  setActiveSheet(name) {
    const tilesheet = this.tilesheets.get(name);
    if (this.activeSheet) {
      this.activeSheet.div.className = 'tilesheet-selection tilesheet-inactive';
    }

    this.activeSheet = tilesheet;
    this.activeSheet.div.className = 'tilesheet-selection tilesheet-active';

    this.activeSheet.redraw = true;
  }

  startSelection(mouse, canvas, camera) {
    this.activeTiles.empty();
    const tileSize = this.activeSheet.tileSizeScaled;
    const mousePos = mouse.getTilesheetCanvasPos(canvas, camera);
    const col = Math.floor(mousePos.x / tileSize.x);
    const row = Math.floor(mousePos.y / tileSize.y);

    if (mousePos.x < 0 || mousePos.x > this.activeSheet.scaledWidth ||
        mousePos.y < 0 || mousePos.y > this.activeSheet.scaledHeight) {
      return;
    }

    this.tileSelection = new Selection(col, row);

    this.selecting = true;
  }

  updateSelection(mouse, canvas, camera) {
    const tileSize = this.activeSheet.tileSizeScaled;
    const mousePos = mouse.getTilesheetCanvasPos(canvas, camera);
    const col = Math.floor(mousePos.x / tileSize.x);
    const row = Math.floor(mousePos.y / tileSize.y);

    if (mousePos.x < 0 || mousePos.x > this.activeSheet.scaledWidth ||
        mousePos.y < 0 || mousePos.y > this.activeSheet.scaledHeight) {
      return;
    }

    if (col !== this.tileSelection.endCol) {
      this.tileSelection.endCol = col;
    }

    if (row !== this.tileSelection.endRow) {
      this.tileSelection.endRow = row;
    }
  }

  endSelection() {
    let col = this.tileSelection.startCol;
    let row = this.tileSelection.startRow;

    if (this.tileSelection.w < 0) {
      col = this.tileSelection.endCol;
    }
    if (this.tileSelection.h < 0) {
      row = this.tileSelection.endRow;
    }

    for (let offsetCol = 0; offsetCol < Math.abs(this.tileSelection.w); offsetCol++) {
      for (let offsetRow = 0; offsetRow < Math.abs(this.tileSelection.h); offsetRow++) {
        this.activeTiles.set(new Sprite(
          new Vector2(
            (col + offsetCol) * this.activeSheet.tileSize.x,
            (row + offsetRow) * this.activeSheet.tileSize.y
          ),
          new Vector2(this.activeSheet.tileSize.x, this.activeSheet.tileSize.y),
          this.activeSheet.image
        ), offsetCol, offsetRow);
      }
    }

    this.selecting = false;
  }

  selectTile(mouse, canvas) {
    const tileSize = this.activeSheet.tileSizeScaled;
    const col = Math.floor(
      (mouse.pos.x - canvas.offsetParent.offsetLeft - canvas.offsetLeft) / tileSize.x // Need offset parent due to relative positioning
    );
    const row = Math.floor(
      (mouse.pos.y - canvas.offsetParent.offsetTop - canvas.offsetTop) / tileSize.y  // Need offset parent due to relative positioning
    );

    this.activeTile.set(new Sprite(
      new Vector2(col * this.activeSheet.tileSize.x, row * this.activeSheet.tileSize.y),
      new Vector2(this.activeSheet.tileSize.x, this.activeSheet.tileSize.y)
    ), col, row);
  }

  changeZoom(dz) {
    if (this.activeSheet) {
      this.activeSheet.changeZoom(dz);
    }
  }

  toJSON() {
    const result = {};

    result.tilesheets = {};
    this.tilesheets.forEach(tilesheet => {
      result.tilesheets[tilesheet.name] = tilesheet.toJSON();
    });
    result.activeSheet = null;
    if (this.activeSheet) {
      result.activeSheet = this.activeSheet.name;
    }

    return result;
  }
}

export class Tilesheet {
  constructor(image, name, tileSize, offset, margin) {
    this.image = image;
    this.name = name;
    this.tileSize = tileSize;
    this.offest = offset;
    this.margin = margin;
    this.ratio = 1;
    this.zoom = 1;
    this.redraw = true;
  }

  get tileSizeScaled() {
    return {
      x: this.tileSize.x * this.ratio * this.zoom,
      y: this.tileSize.y * this.ratio * this.zoom
    }
  }

  get scaledWidth() {
    return this.image.width * this.ratio * this.zoom;
  }

  get scaledHeight() {
    return this.image.height * this.ratio * this.zoom;
  }

  setRatio(canvas, event) {
    this.ratio = canvas.width / this.image.width;

    if (this.image.height * this.ratio > canvas.height) {
      this.ratio = canvas.height / this.image.height;
    }
  }

  changeZoom(dz) {
    this.zoom += dz;
    this.zoom = Math.min(Math.max(this.zoom, 0.2), 3);
    this.redraw = true;
  }

  toJSON() {
    const result = {};

    result.image = this.image.name;
    result.name = this.name;
    result.tileSize = this.tileSize;
    result.offset = this.offset;
    result.margin = this.margin;
    result.zoom = this.zoom;

    return result;
  }
}

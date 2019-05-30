import Vector2 from '../../math/Vector2.js';

function createMainBackgroundLayer(canvas, settings) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');

  return function draw(ctx, camera) {
    const tileDims = settings.dims.tile;
    const canvasDims = settings.dims.canvas;
    ctx.fillStyle = '#1a191d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (settings.redraw.main) {
      buffer.width = canvasDims.x * tileDims.x;
      buffer.height = canvasDims.y * tileDims.y;

      bctx.fillStyle = 'white';
      bctx.fillRect(0, 0, buffer.width, buffer.height);

      let margin = new Vector2();
      if (buffer.width < canvas.width) {
        margin.x = (canvas.width - buffer.width) / 2;
      }
      if (buffer.height < canvas.height) {
        margin.y = (canvas.height - buffer.height) / 2;
      }
      settings.margin = margin;
    }

    let bufferPos = {
      x: 0,
      y: 0,
    }
    let pos = {
      x: settings.margin.x - camera.pos.x,
      y: settings.margin.y - camera.pos.y,
    }

    if (camera.pos.x > settings.margin.x) {
      bufferPos.x = camera.pos.x - settings.margin.x;
      pos.x = 0;
    }
    if (camera.pos.y > settings.margin.y) {
      bufferPos.y = camera.pos.y - settings.margin.y;
      pos.y = 0;
    }

    let width = canvas.width;
    if (bufferPos.x + width > buffer.width) {
      width = buffer.width - bufferPos.x;
    }

    let height = canvas.height;
    if (bufferPos.y + height > buffer.height) {
      height = buffer.height - bufferPos.y;
    }

    ctx.drawImage(
      buffer, bufferPos.x, bufferPos.y, width, height,
      pos.x, pos.y, width, height
    );
  }
}

function createMainGridLayer(canvas, settings) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');

  return function draw(ctx, camera) {
    const tileDims = settings.dims.tile;
    const canvasDims = settings.dims.canvas;

    if (settings.redraw.main) {
      buffer.width = canvasDims.x * tileDims.x;
      buffer.height = canvasDims.y * tileDims.y;

      bctx.strokeStyle = '#8b8b8b';
      bctx.lineWidth = '1';

      bctx.beginPath();
      const cols = Math.floor(buffer.width / tileDims.x);
      for (let col = 0; col < cols; col++) {
        bctx.moveTo(col * tileDims.x, 0);
        bctx.lineTo(col * tileDims.x, buffer.height);
        bctx.stroke();
      }
      bctx.closePath();

      bctx.beginPath();
      const rows = Math.floor(buffer.height / tileDims.y);
      for (let row = 0; row < rows; row++) {
        bctx.moveTo(0, row * tileDims.y);
        bctx.lineTo(buffer.width, row * tileDims.y);
        bctx.stroke();
      }
      bctx.closePath();

      settings.redraw.main = false;
    }

    let bufferPos = {
      x: 0,
      y: 0,
    }
    let pos = {
      x: settings.margin.x - camera.pos.x,
      y: settings.margin.y - camera.pos.y,
    }

    if (camera.pos.x > settings.margin.x) {
      bufferPos.x = camera.pos.x - settings.margin.x;
      pos.x = 0;
    }
    if (camera.pos.y > settings.margin.y) {
      bufferPos.y = camera.pos.y - settings.margin.y;
      pos.y = 0;
    }

    let width = canvas.width;
    if (bufferPos.x + width > buffer.width) {
      width = buffer.width - bufferPos.x;
    }

    let height = canvas.height;
    if (bufferPos.y + height > buffer.height) {
      height = buffer.height - bufferPos.y;
    }

    if (settings.showGrid) {
      ctx.drawImage(
        buffer, bufferPos.x, bufferPos.y, width, height,
        pos.x, pos.y, width, height
      );
    }
  }
}

function createLevelLayer(canvas, settings, tsManager, level) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');

  return function draw(ctx, camera) {
    if (level.redraw) {
      const tileSize = settings.dims.tile;
      const width = level.cols * tileSize.x;
      const height = level.rows * tileSize.y;

      buffer.height = height;
      buffer.width = width;

      level.layers.forEach(layer => {
        if (!layer.visible) {
          return;
        }

        if (!layer.buffer) {
          layer.buffer = document.createElement('canvas');
          layer.ctx = layer.buffer.getContext('2d');
        }

        layer.buffer.width = width;
        layer.buffer.height = height;

        layer.tiles.forEach((tile, col, row) => {
          if (tile === null || tile.pos === null) {
            return;
          }

          layer.ctx.drawImage(
            tsManager.activeSheet.image,
            tile.pos.x, tile.pos.y, tile.dims.x, tile.dims.y,
            col * tileSize.x, row * tileSize.y, tileSize.x, tileSize.y
          );
        });

        bctx.drawImage(layer.buffer, 0, 0);
        level.redraw = false;
      });
    }

    ctx.drawImage(buffer, settings.margin.x - camera.pos.x, settings.margin.y - camera.pos.y);
  }
}

function createSelectionLayer(canvas, settings, paintbrush) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  let lineWidth = Math.floor(settings.dims.tile.x / 8);
  let redraw = true;

  return function draw(ctx, camera) {
    if (!paintbrush.currentSelection) {
      return;
    }

    const tileSize = settings.dims.tile;
    const width = paintbrush.currentSelection.w;
    const height = paintbrush.currentSelection.h;

    if (buffer.width !== tileSize.x * Math.abs(paintbrush.currentSelection.w)) {
      lineWidth = Math.floor(settings.dims.tile.x / 8);
      buffer.width = tileSize.x * Math.abs(paintbrush.currentSelection.w) + lineWidth;
      redraw = true;
    }
    if (buffer.height !== tileSize.y * Math.abs(paintbrush.currentSelection.h)) {
      lineWidth = Math.floor(settings.dims.tile.x / 8);
      buffer.height = tileSize.y * Math.abs(paintbrush.currentSelection.h) + lineWidth;
      redraw = true;
    }

    if (redraw) {
      bctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      bctx.strokeStyle = '#151515';
      bctx.lineWidth = lineWidth;
      bctx.beginPath();
      bctx.rect(0, 0, buffer.width, buffer.height);
      bctx.fill();
      bctx.stroke();
      bctx.closePath();
      redraw = false;
    }

    let x = paintbrush.currentSelection.startCol * tileSize.x + settings.margin.x - camera.pos.x - lineWidth / 2;
    let y = paintbrush.currentSelection.startRow * tileSize.y + settings.margin.y - camera.pos.y - lineWidth / 2;

    if (width < 0) {
      x = paintbrush.currentSelection.endCol * tileSize.x + settings.margin.x - camera.pos.x - lineWidth / 2;
    }

    if (height < 0) {
      y = paintbrush.currentSelection.endRow * tileSize.y + settings.margin.y - camera.pos.y - lineWidth / 2;
    }

    ctx.drawImage(buffer, x, y);
  }
}

function createMainMouseLayer(canvas, settings, mouse, tsManager, paintbrush) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  let lineWidth = Math.floor(settings.dims.tile.x / 8);

  return function draw(ctx, camera) {
    if (mouse.pos.x < canvas.offsetLeft || mouse.pos.x > canvas.offsetLeft + canvas.width ||
        mouse.pos.y < canvas.offsetTop || mouse.pos.y > canvas.offsetTop + canvas.height) {
      return;
    }

    const tileSize = settings.dims.tile;
    if (buffer.width !== tileSize.x + lineWidth  ||
        buffer.height !== tileSize.y + lineWidth ) {
      lineWidth = Math.floor(tileSize.x / 8);
      buffer.width = tileSize.x + lineWidth;
      buffer.height = tileSize.y + lineWidth;
    }

    if (tsManager.hasTile) {
      buffer.width = Math.abs(tsManager.activeTiles.w) * tileSize.x + lineWidth;
      buffer.height = Math.abs(tsManager.activeTiles.h) * tileSize.y + lineWidth;

      tsManager.activeTiles.forEach((tile, col, row) => {
        bctx.drawImage(
          tsManager.activeSheet.image,
          tile.pos.x, tile.pos.y, tile.dims.x, tile.dims.y,
          lineWidth / 2 + col * tileSize.x, lineWidth / 2 + row * tileSize.y, tileSize.x, tileSize.y
        );
      });
    }

    bctx.fillStyle = 'rgba(192, 218, 255, 0.15)';
    bctx.strokeStyle = 'blue';
    if (paintbrush.getMode() === 'erase') {
      bctx.fillStyle = 'rgba(255, 192, 192, 0.15)';
      bctx.strokeStyle = 'red';
    }
    bctx.lineWidth = lineWidth;

    bctx.beginPath();
    bctx.rect(0, 0, buffer.width, buffer.height);
    bctx.fill();
    bctx.stroke();
    bctx.closePath();

    const col = Math.floor(
      (mouse.pos.x - canvas.offsetLeft + camera.pos.x - settings.margin.x) / tileSize.x
    );
    const row = Math.floor(
      (mouse.pos.y - canvas.offsetTop + camera.pos.y - settings.margin.y) / tileSize.y
    );
    const x = col * tileSize.x + settings.margin.x - camera.pos.x - lineWidth / 2;
    const y = row * tileSize.y + settings.margin.y - camera.pos.y - lineWidth / 2;

    if (col < 0 || col >= settings.dims.canvas.x) {
      return;
    }

    if (row < 0 || row >= settings.dims.canvas.y) {
      return;
    }

    ctx.globalAlpha = 0.33;
    ctx.drawImage(buffer, x, y);
    ctx.globalAlpha = 1;
  }
}

function createHoverLayer(canvas, settings, mouse, level, tsManager) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  buffer.width = 150;
  buffer.height = 200;

  return function draw(ctx, camera) {
    const tileSize = settings.dims.tile;
    const mousePos = mouse.getMainCanvasPos(canvas, settings, camera);
    const col = Math.floor(mousePos.x / tileSize.x);
    const row = Math.floor(mousePos.y / tileSize.y);

    if (!level.has(col, row)) {
      return;
    }

    if (mouse.isIdle) {
      bctx.fillStyle = '#a8a8ad';
      bctx.fillRect(0, 0, buffer.width, buffer.height);

      const sprite = level.getTile(col, row);
      const width = 56;
      const height = 56;
      const imagePos = new Vector2((buffer.width - width) / 2, 20);
      const lineWidth = 2;
      bctx.fillStyle = 'black';
      bctx.fillRect(
        imagePos.x - lineWidth, imagePos.y - lineWidth,
        width + lineWidth * 2, height + lineWidth * 2
      );
      if (sprite) {
        bctx.drawImage(
          tsManager.activeSheet.image,
          sprite.pos.x, sprite.pos.y, sprite.dims.x, sprite.dims.y,
          imagePos.x, imagePos.y, width, height
        );
      } else {
        bctx.fillStyle = 'white';
        bctx.fillRect(imagePos.x, imagePos.y, width, height);
      }

      const x = (col + 1) * tileSize.x + settings.margin.x - camera.pos.x;
      const y = (row + 0.5) * tileSize.y + settings.margin.y - camera.pos.y;

      ctx.drawImage(buffer, x, y);
    }
  }
}

export default function createMainCanvasLayers(canvas, settings, mouse, tsManager, level, paintbrush) {
  const result = [];
  result.push(createMainBackgroundLayer(canvas, settings));
  result.push(createLevelLayer(canvas, settings, tsManager, level, tsManager));
  result.push(createSelectionLayer(canvas, settings, paintbrush));
  result.push(createMainGridLayer(canvas, settings));
  result.push(createMainMouseLayer(canvas, settings, mouse, tsManager, paintbrush));
  result.push(createHoverLayer(canvas, settings, mouse, level, tsManager));
  return result;
}

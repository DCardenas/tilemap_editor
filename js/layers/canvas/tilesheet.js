function createBackgroundLayer(canvas, tsManager) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  
  return function draw(ctx) {
    if (buffer.width !== canvas.width) {
      buffer.width = canvas.width;
    }
    
    if (buffer.height !== canvas.height) {
      buffer.height = canvas.height;
    }
    
    bctx.fillStyle = 'white';
    
    if (tsManager.activeSheet) {
      bctx.fillStyle = '#1a191d';
    }
    
    bctx.fillRect(0, 0, buffer.width, buffer.height);
    
    
    if (!tsManager.activeSheet) {
      bctx.fillStyle = 'black';
      bctx.font = '20px Montserrat';
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText('No Tilesheet Loaded...', buffer.width / 2, buffer.height / 2);
    }
    
    ctx.drawImage(buffer, 0, 0);
  }
}

function createTilesheetLayer(canvas, tsManager) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  
  return function draw(ctx, camera) {
    
    if (!tsManager.activeSheet) {
      return;
    }
    
    const tilesheet = tsManager.activeSheet;
    if (tilesheet.redraw) {
      const zoom = tilesheet.zoom;
      const image = tilesheet.image;
      
      if (buffer.width !== image.width * tilesheet.ratio * zoom ||
          buffer.height !== image.height * tilesheet.ratio * zoom) {
        buffer.width = image.width * tilesheet.ratio * zoom;
        buffer.height = image.height * tilesheet.ratio * zoom;
      }     
      
      bctx.fillStyle = '#b2b2b2';
      bctx.fillRect(0, 0, buffer.width, buffer.height);
      bctx.drawImage(tilesheet.image, 0, 0, buffer.width, buffer.height);

      bctx.lineWidth = 1;
      bctx.strokeStyle = '#717171';
      
      const tileSize = tilesheet.tileSizeScaled;
      const cols = Math.floor(buffer.width / tileSize.x) + 1;
      bctx.beginPath();
      for (let col = 0; col < cols; col++) {
        bctx.moveTo(col * tileSize.x, 0);
        bctx.lineTo(col * tileSize.x, buffer.height);
        bctx.stroke();
      }
      bctx.closePath();

      const rows = Math.floor(buffer.height / tileSize.y) + 1;
      bctx.beginPath();
      for (let row = 0; row < rows; row++) {
        bctx.moveTo(0, row * tileSize.y);
        bctx.lineTo(buffer.width, row * tileSize.y);
        bctx.stroke();
      }
      bctx.closePath();
      
      tsManager.activeSheet.redraw = false;
    }
    
    ctx.drawImage(buffer, -camera.pos.x, -camera.pos.y);
  }
}

function createMouseLayer(canvas, mouse, tsManager) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  
  return function draw(ctx, camera) {
    let tilesheet = tsManager.activeSheet;
    if (!tilesheet || 
        mouse.pos.x < canvas.offsetParent.offsetLeft + canvas.offsetLeft || 
        mouse.pos.x > canvas.offsetParent.offsetLeft + canvas.offsetLeft + canvas.width ||
        mouse.pos.y < canvas.offsetParent.offsetTop + canvas.offsetTop || 
        mouse.pos.y > canvas.offsetParent.offsetTop + canvas.offsetTop + canvas.height) {
      return;
    }
    
    let lineWidth = Math.floor(tilesheet.tileSizeScaled.x / 8);
    
    if (buffer.width !== tilesheet.tileSize.x + lineWidth  || 
        buffer.height !== tilesheet.tileSize.y + lineWidth ) {
      lineWidth = Math.floor(tilesheet.tileSize.x / 8);
      buffer.width = parseInt(tilesheet.tileSize.x) + lineWidth;
      buffer.height = parseInt(tilesheet.tileSize.y) + lineWidth;
    }    
    
    bctx.fillStyle = 'rgba(0, 108, 255, 0.25)';
    bctx.strokeStyle = 'blue';
    bctx.lineWidth = lineWidth;
    
    bctx.beginPath();
    bctx.rect(0, 0, buffer.width, buffer.height);
    bctx.fill();
    bctx.stroke();
    bctx.closePath();
    
    const tileSize = tilesheet.tileSizeScaled;
    const mousePos = mouse.getTilesheetCanvasPos(canvas, camera);
    const col = Math.floor(mousePos.x / tileSize.x);
    const row = Math.floor(mousePos.y / tileSize.y);
    const x = col * tileSize.x - camera.pos.x;
    const y = row * tileSize.y - camera.pos.y;
    
    if (x < -lineWidth || x >= tilesheet.image.width * tilesheet.ratio) {
      return;
    }
    
    if (y < -lineWidth || y >= tilesheet.image.height * tilesheet.ratio) {
      return;
    }

    ctx.globalAlpha = 0.5;
    ctx.drawImage(buffer, x, y, tileSize.x, tileSize.y);
    ctx.globalAlpha = 1;
  }
}

function createSelectionLayer(canvas, mouse, tsManager) {
  const buffer = document.createElement('canvas');
  const bctx = buffer.getContext('2d');
  
  return function draw(ctx, camera) {
    if (!tsManager.tileSelection) {
      return;
    }
    
    const lineWidth = 8;
    const tilesheet = tsManager.activeSheet;
    const tileSize = tilesheet.tileSizeScaled;
    let x = tsManager.tileSelection.startCol * tileSize.x - camera.pos.x;
    let y = tsManager.tileSelection.startRow * tileSize.y - camera.pos.y;
    let w = tsManager.tileSelection.w * tileSize.x;
    let h = tsManager.tileSelection.h * tileSize.y;
    
    if (w < 0) {
      x = tsManager.tileSelection.endCol * tileSize.x - camera.pos.x;
      w = Math.abs(w);
    }
    
    if (h < 0) {
      y = tsManager.tileSelection.endRow * tileSize.y - camera.pos.y;
      h = Math.abs(h);
    }
    
    buffer.width = w + lineWidth;
    buffer.height = h + lineWidth;
    
    bctx.lineWidth = lineWidth;
    bctx.fillStyle = 'rgba(128, 128, 128, 0.33)';
    bctx.strokeStyle = 'black';
    bctx.beginPath();
    bctx.rect(0, 0, buffer.width, buffer.height);
    bctx.stroke();
    bctx.fill();
    bctx.closePath();
    
    ctx.drawImage(buffer, x - lineWidth / 2, y - lineWidth / 2);
  }
}

export default function createTilesheetCanvasLayers(canvas, mouse, tsManager) {
  const result = [];
  result.push(createBackgroundLayer(canvas, tsManager));
  result.push(createTilesheetLayer(canvas, tsManager));
  result.push(createMouseLayer(canvas, mouse, tsManager));
  result.push(createSelectionLayer(canvas, mouse, tsManager));
  return result;
}
import {Paintbrush, PaintbrushMode} from '../paintbrush/Paintbrush.js';
import Selection from '../paintbrush/Selection.js';
import Vector2 from '../math/Vector2.js';

export default function setupPaintbrush(mouse, level, canvas, settings, camera, tsManager) {
  const paintbrush = new Paintbrush();
  
  mouse.addCallback('mousedown', event => {
    if (!tsManager.loading && 
        event.target.getAttribute('id') === canvas.getAttribute('id')) {
      
      mouse.clickPos.set(event.clientX, event.clientY);
      const mousePos = mouse.getMainCanvasPos(canvas, settings, camera);
      const col = Math.floor(
        mousePos.x / settings.dims.tile.x
      );
      const row = Math.floor(
        mousePos.y / settings.dims.tile.y
      );
      
      paintbrush.onmousedown(event.which, mousePos, col, row);
    }
  });
  mouse.addCallback('mousemove', event => {
    if (tsManager.loading && 
        event.target.getAttribute('id') !== canvas.getAttribute('id')) {
      return;
    }
    const mousePos = mouse.getMainCanvasPos(canvas, settings, camera);
    const col = Math.floor(
      mousePos.x / settings.dims.tile.x
    );
    const row = Math.floor(
      mousePos.y / settings.dims.tile.y
    );
    paintbrush.onmousemove(event.which, mousePos, col, row);
  });
  mouse.addCallback('mouseup', event => {
    if (!tsManager.loading && 
      event.target.getAttribute('id') === canvas.getAttribute('id')) {
      mouse.upPos.set(event.clientX, event.clientY);
      const mousePos = mouse.getMainCanvasPos(canvas, settings, camera);
      const col = Math.floor(
        mousePos.x / settings.dims.tile.x
      );
      const row = Math.floor(
        mousePos.y / settings.dims.tile.y
      );

      paintbrush.onmouseup(event.which, mousePos, col, row);
    }
  })
  
  const paintMode = new PaintbrushMode('paint');
  paintMode.activate = () => {
    return;
  }
  paintMode.deactivate = () => {
    return;
  }
  paintMode.onmousedown = () => {
    return;
  }
  paintMode.onmouseup = (button, pos, col, row) => {
    if (mouse.clickPos.distTo(mouse.upPos) >= mouse.forgiveness) {
      return;
    }
    
    if (!tsManager.hasTile || button !== 1) {
      return;
    }
    
    tsManager.activeTiles.forEach((sprite, offsetCol, offsetRow) => {
      level.setTile(sprite, col + offsetCol, row + offsetRow);
    });
    level.redraw = true;
  }
  paintMode.onmousemove = (button, pos, col, row) => {
    if (tsManager.hasTile && mouse.isDown) {
      tsManager.activeTiles.forEach((sprite, offsetCol, offsetRow) => {
          level.setTile(sprite, col + offsetCol, row + offsetRow);
      });

      level.redraw = true;
    }
  }

  const eraseMode = new PaintbrushMode('erase');
  eraseMode.activate = () => {
    if (tsManager.hasTile) {
      tsManager.activeTiles.empty();
    }
  }
  eraseMode.deactivate = () => {
    return;
  }
  eraseMode.onmouseup = (button, pos, col, row) => {
    if (mouse.clickPos.distTo(mouse.upPos) >= mouse.forgiveness || button !== 1) {
      return;
    }
    
    level.setTile(null, col, row);
    level.redraw = true;
  }
  eraseMode.onmousemove = (button, pos, col, row) => {
    if (mouse.isDown) {
      if (level.getTile(col, row)) {
        level.setTile(null, col, row);
        level.redraw = true;
      }
    }
  }

  const fillMode = new PaintbrushMode('fill');
  fillMode.activate = () => {
    return;
  }
  fillMode.deactivate = () => {
    return;
  }
  function floodFill(fillSprite, col, row, offsetStart=new Vector2()) {
    // Fill in tile-clicked
    const sprites = tsManager.activeTiles;
    const w = Math.abs(sprites.w);
    const h = Math.abs(sprites.h);
    level.setTile(sprites.get(offsetStart.x, offsetStart.y), col, row);
    
    let clickedInSelection = false;
    
    if (paintbrush.currentSelection && 
        paintbrush.currentSelection.contains(col, row)) {
      clickedInSelection = true;
    }
    
    // Check NSEW
    function checkNeighbors(col, row, offset) {
      const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
      directions.forEach(dir => {
        const newCol = col + dir[0];
        const newRow = row + dir[1];
        
        if (!level.has(newCol, newRow)) {
          return
        }
        
        const target = level.getTile(newCol, newRow);
        if (target) {
          if (target.sameAs(tsManager.activeTiles.get(offset.x, offset.y)) || 
              !target.sameAs(fillSprite)) {
            return
          }
        }
        if (paintbrush.currentSelection) {
          if (clickedInSelection !== paintbrush.currentSelection.contains(newCol, newRow)) {
            return
          }
        }
        
        offset.x = offset.x + dir[0];
        offset.y = offset.y + dir[1];
        
        if (offset.x < 0) {
          offset.x += w;
        } else if (offset.x >= w) {
          offset.x -= w;
        }
        
        if (offset.y < 0) {
          offset.y += h;
        } else if (offset.y >= h) {
          offset.y -= h;
        }
        
        level.setTile(sprites.get(offset.x, offset.y), newCol, newRow);
        
        checkNeighbors(newCol, newRow, offset);
      });
    }
      
    checkNeighbors(col, row, offsetStart);
    level.redraw = true;
  }
  fillMode.onmouseup = (button, pos, col, row) => {
    if (mouse.clickPos.distTo(mouse.upPos) >= mouse.forgiveness) {
      return;
    }
    
    if (!tsManager.hasTile || button !== 1) {
      return;
    }
    
    const clickedSprite = level.getTile(col, row);
    floodFill(clickedSprite, col, row);
  }
  
  const selectMode = new PaintbrushMode('select');
  selectMode.selecting = false;
  selectMode.activate = () => {
    return;
  }
  selectMode.deactivate = () => {
    return;
  }
  selectMode.onmousedown = (button, pos, col, row) => {
    if (button === 1 && level.has(col, row)) {
      paintbrush.currentSelection = new Selection(col, row);
      selectMode.selecting = true;
    }
  }
  selectMode.onmousemove = (button, pos, col, row) => {
    if (selectMode.selecting && level.has(col, row)) {
      if (col !== paintbrush.currentSelection.endCol) {
        paintbrush.currentSelection.endCol = col; 
      }

      if (row !== paintbrush.currentSelection.endRow) {
        paintbrush.currentSelection.endRow= row; 
      }
    }
  }
  selectMode.onmouseup = (button, pos, col, row) => {
    if (button === 1) {
      selectMode.selecting = false;
    }
  }

  paintbrush.addMode(paintMode);
  paintbrush.addMode(eraseMode);
  paintbrush.addMode(fillMode);
  paintbrush.addMode(selectMode);
  paintbrush.setMode('paint');
  return paintbrush;
}
import MouseManager from '../inputs/MouseManager.js';

export default function setupMouse(canvas, camera, tsManager) {
  const mouse = new MouseManager();
  
  ['mousemove', 'mousedown', 'mouseup', 'contextmenu', 'wheel'].forEach(type => {
    mouse.listenTo(window, type);
  });
  mouse.addCallback('mousedown', event => {  
    mouse.setIdle(false);
    
    if (document.getElementById('overlay').style.visibility === 'visible') {
      return;
    }
    
    const targetID = event.target.getAttribute('id');
    
    if (targetID === canvas.main.getAttribute('id')) {
      event.preventDefault();
            
      if (event.which === 1) {
        mouse.isDown = true;
      } else if (event.which === 3) {
        camera.main.following = true;
      }
    } else if (targetID === canvas.tilesheet.getAttribute('id')) {
      event.preventDefault();
            
      if (event.which === 1) {
        mouse.isDown = true;
      } else if (event.which === 3 && tsManager.activeSheet) {
        camera.tilesheet.following = true;
      }
      
      if (event.which === 1 && tsManager.activeSheet) {
        tsManager.startSelection(mouse, canvas.tilesheet, camera.tilesheet);
      }
    }
  });
  mouse.addCallback('mousemove', event => {
    mouse.setIdle(false);
    
    if (document.getElementById('overlay').style.visibility === 'visible') {
      return;
    }
    
    const targetID = event.target.getAttribute('id');
    
    if (camera.main.following) {
      camera.main.changePos(
        mouse.pos.x - event.clientX, 
        mouse.pos.y - event.clientY 
      );
    } else if (camera.tilesheet.following) {
      camera.tilesheet.changePos(
        mouse.pos.x - event.clientX, 
        mouse.pos.y - event.clientY 
      );
    }
    
    if (targetID === canvas.main.getAttribute('id')) {
      event.preventDefault();
    } else if (targetID === canvas.tilesheet.getAttribute('id')) {
      event.preventDefault();
      
      if (tsManager.selecting) {
        tsManager.updateSelection(mouse, canvas.tilesheet, camera.tilesheet);      
      }
    }
    
    mouse.pos.set(event.clientX, event.clientY);
  });
  mouse.addCallback('mouseup', event => {
    mouse.setIdle(false);

    if (document.getElementById('overlay').style.visibility === 'visible') {
      return;
    }
    
    if (event.which === 1) {
      mouse.isDown = false;
    } else if (event.which === 3) {
      camera.main.following = false;
      camera.tilesheet.following = false;
    }
    
    const targetID = event.target.getAttribute('id');

    if (targetID === canvas.main.getAttribute('id')) {  
      
    } else if (targetID === canvas.tilesheet.getAttribute('id')) {      
      if(event.which === 1 && tsManager.selecting) {
        tsManager.endSelection();
      }
    }
  });
  mouse.addCallback('contextmenu', event => {
    if (event.target.getAttribute('id') === canvas.main.getAttribute('id') ||
        event.target.getAttribute('id') === canvas.tilesheet.getAttribute('id')) {
      event.preventDefault();
    }
  });
  
  return mouse;
}
export class PaintbrushMode {
  constructor(name) {
    this.name = name;
  }
  
  onmousedown(event) {

  }
  
  onmouseup(event) {

  }
  
  onmousemove(event) {
    
  }
  
  activate() {

  }
  
  deactivate() {

  }
}
export class Paintbrush {
  constructor() {
    this.mode = null;
    this.modes = new Map();
    this.buttons = {
      paint: document.getElementById('button--paint'),
      erase: document.getElementById('button--erase'),
      fill: document.getElementById('button--fill'),
      select: document.getElementById('button--select'),
    }
    
    Object.keys(this.buttons).forEach(key => {
      this.buttons[key].onclick = () => {
        this.setMode(key);
      }
    });
    
    this.currentSelection = null;
  }
  
  setMode(name) {
    if (!this.modes.has(name)) {
      console.log('Paintbrush does not have a mode called ' + name);
      return;
    }
    
    if (this.mode) {
      this.mode.deactivate();
      this.buttons[this.mode.name].className = 'button--toolbar button--active';
    }
    
    this.mode = this.modes.get(name);
    this.buttons[name].className = 'button--toolbar button--selected';
    this.mode.activate();
  }

  getMode() {
    if (!this.mode) {
      return null;
    }
    
    return this.mode.name;
  }
  
  addMode(mode) {
    this.modes.set(mode.name, mode);
  }
  
  onmousedown(button, pos, col, row) {
    if (this.mode) {
      this.mode.onmousedown(button, pos, col, row);
    }
  }
  
  onmouseup(button, pos, col, row) {
    if (this.mode) {
      this.mode.onmouseup(button, pos, col, row);
    }
  }
  
  onmousemove(button, pos, col, row) {
    if (this.mode) {
      this.mode.onmousemove(button, pos, col, row);
    }
  }
}

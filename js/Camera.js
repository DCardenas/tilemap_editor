import Vector2 from './math/Vector2.js';

export default class Camera {
  constructor() {
    this.pos = new Vector2();
    this.following = false;
    this.locked = false;
    this.redraw = true;
  }
  
  changePos(dx, dy) {
    this.pos.x += dx;
    this.pos.y += dy;
    
    if (this.x < 0) {
      this.x = 0;
    }
    
    if (this.y < 0) {
      this.y = 0;
    }
    
    this.redraw = true;
  }
}

import Vector2 from './math/Vector2.js';

export default class Camera {
  constructor() {
    this.pos = new Vector2();
    this.targetPos = new Vector2();
    this.following = false;
    this.locked = false;
    this.redraw = true;
  }

  changePos(dx, dy) {
    this.targetPos.x += dx;
    this.targetPos.y += dy;

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = 0;
    }
  }

  update() {
    if (this.pos.x !== this.targetPos.x) {
      const dx = this.targetPos.x - this.pos.x;
      this.pos.x += dx * 0.1;
      this.redraw = true;
    }

    if (this.pos.y !== this.targetPos.y) {
      const dy = this.targetPos.y - this.pos.y;
      this.pos.y += dy * 0.2;
      this.redraw = true;
    }
  }
}

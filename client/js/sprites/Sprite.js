export default class Sprite {
  constructor(pos=null, dims=null, spritesheet=null, id=Math.random()) {
    this.pos = pos;
    this.dims = dims;
    this.spritesheet = spritesheet;
    this.id = id;
  }

  sameAs(sprite) {
    if (sprite && this.pos === sprite.pos && this.dims === sprite.dims) {
      return true;
    }

    return false;
  }

  toJSON() {
    if (!this.pos || !this.dims) {
      return null;
    }

    return {
      x: this.pos.x,
      y: this.pos.y,
      w: this.dims.x,
      h: this.dims.y
    }
  }
}

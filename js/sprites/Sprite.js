export default class Sprite {
  constructor(pos=null, dims=null, id=0) {
    this.pos = pos;
    this.dims = dims;
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

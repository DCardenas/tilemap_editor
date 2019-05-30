export default class Vector2 {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }
  
  get size() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  set(x, y) {
    this.x = x;
    this.y = y;
  }
  
  distTo(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    
    return Math.sqrt(dx * dx + dy * dy);
  }
}

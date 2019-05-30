export default class Matrix {
  constructor() {
    this.grid = new Map();
    this.w = 0;
    this.h = 0;
  }
  
  get isEmpty() {
    let result = true;
    this.forEach((item, col, row) => {
      if (!result) {
        return;
      }
      
      if (item) {
        result = false;
      }
    });
    return result;
  }
  
  set(obj, col, row) {
    if (!this.grid.has(col)) {
      this.grid.set(col, new Map());
    }
    
    if (col + 1 > this.w) {
      this.w = col + 1;
    }
    
    if (row + 1 > this.h) {
      this.h = row + 1;
    }
    
    this.grid.get(col).set(row, obj);
  }
  
  get(col, row) {
    if (!this.grid.has(col) || !this.grid.get(col).has(row)) {
      return null;
    }
    
    return this.grid.get(col).get(row);
  }
  
  empty() {
    this.grid = new Map();
    this.w = 1;
    this.h = 1;
  }
  
  forEach(callback) {
    this.grid.forEach((col, x) => {
      col.forEach((item, y) => {
        callback(item, x, y);
      });
    });
  }
}

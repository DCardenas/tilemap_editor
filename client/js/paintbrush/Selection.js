export default class Selection {
  constructor(col, row) {
    this.startCol = col;
    this.startRow = row;
    this.endCol = col;
    this.endRow = row;
  }
  
  get w() {
    let width = this.endCol - this.startCol;
    if (width < 0) {
      width -= 1;
    } else {
      width += 1;
    }
    
    return width;
  }
  
  get h() {
    let height = this.endRow - this.startRow;
    if (height < 0) {
      height -= 1;
    } else {
      height += 1;
    }
    return height;
  }
  
  contains(col, row) {
    if ((col - this.startCol) * (col - this.endCol) <= 0 &&
        (row - this.startRow) * (row - this.endRow) <= 0) {
      return true;
    }
    
    return false;
  }
  
  forEach(callback) {
    for (let x = this.startCol; x <= this.endCol; x++) {
      for (let y = this.startRow; y <= this.endRow; y++) {
        callback(x, y);
      }
    }
  }
}
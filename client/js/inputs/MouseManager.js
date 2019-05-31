import Vector2 from '../math/Vector2.js';

export default class MouseManager {
  constructor() {
    this.pos = new Vector2();
    this.callbacks = new Map();
    this.isDown = false;
    this.isIdle = false;
    this.clickPos = new Vector2();
    this.upPos = new Vector2();
    this.forgiveness = 5;
    this.idle = 0;
    this.idleCD = 1000;
  }

  getMainCanvasPos(canvas, settings, camera) {
    return {
      x: this.pos.x - canvas.offsetParent.offsetLeft + camera.pos.x - settings.margin.x,
      y: this.pos.y - canvas.offsetParent.offsetTop + camera.pos.y - settings.margin.y
    }
  }

  getTilesheetCanvasPos(canvas, camera) {
    return {
      x: this.pos.x - canvas.offsetParent.offsetLeft - canvas.offsetLeft + camera.pos.x,
      y: this.pos.y - canvas.offsetParent.offsetTop - canvas.offsetTop + camera.pos.y
    }
  }

  listenTo(element, type) {
    this.callbacks.set(type, []);

    element.addEventListener(type, event => {
      this.handleEvent(event);
    });
  }

  addCallback(type, callback) {
    if (!this.callbacks.has(type)) {
      console.error('Attempting to add a callback without listening for this event.');
      return;
    }

    this.callbacks.get(type).push(callback);
  }

  handleEvent(event) {
    if (!this.callbacks.has(event.type)) {
      console.log('Somehow we are not listening for this event!');
      console.log(event);
      return;
    }

    const callbacks = this.callbacks.get(event.type);
    callbacks.forEach(callback => {
      callback(event);
    });
  }

  setIdle(bool) {
    this.isIdle = bool;

    if (!bool) {
      this.idle = 0;
    }
  }
}

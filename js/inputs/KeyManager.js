export default class KeyManager {
  constructor() {
    this.keys = new Map();
    this.callbacks = new Map();
  }
  
  listenTo(window, type) {
    window.addEventListener(type, event => {
      this.handleEvent(event);
    });
  }
  
  addCallback(type, callback) {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, []);
    }
    
    this.callbacks.get(type).push(callback);
  }
  
  handleEvent(event) {    
    if (!this.callbacks.has(event.type)) {
      return;
    }
    
    const pressed = event.type === 'keydown' ? true : false;
    this.keys.set(event.key, pressed);
    this.callbacks.get(event.type).forEach(callback => {
      callback(event);
    });
  }
}

export default class Compositor {
  constructor() {
    this.layerGroups = new Map();
  }
  
  addLayerGroup(name) {
    this.layerGroups.set(name, []);
  }
  
  addLayer(name, layer) {
    this.layerGroups.get(name).push(layer);
  }
  
  draw(ctx, camera) {
    this.layerGroups.forEach((group, name) => {
      group.forEach(layer => {
        layer(ctx[name], camera[name]);
      });
    });
  }
}

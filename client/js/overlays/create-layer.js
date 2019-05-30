export default function createNewLayerOverlay() {
  return `
    <div id='overlay-title'>Create New Layer</div>
    <div id='overlay-layer-name'>
      Name: <input class='input--dim' id='overlay-name' placeholder='Name' type='text' />
    </div>
    <div id='overlay-buttons'>
      <button class='button--inactive' id='button--layer-create'>Create</button>
      <button class='button--active' id='button--layer-cancel'>Cancel</button>
    </div>
  `
}

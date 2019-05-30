export default function removeLayerOverlay() {
  return `
    <div id='overlay-title'>Remove Layer</div>
    Are you sure?
    <div id='overlay-buttons'>
      <button class='button--active' id='button--layer-confirm'>Yes</button>
      <button class='button--active' id='button--layer-cancel'>No</button>
    </div>
  `
}

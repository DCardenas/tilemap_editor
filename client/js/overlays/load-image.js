export default function createLoadTilesheetOverlay() {
  return `
    <div id='overlay-load-file'>
      <div id='file-loaded'>No file selected...</div>
      <label class='label--file-loader button--active' for='input--load-tilesheet'>
        Choose File
        <input id='input--load-tilesheet' type='file' accept='image/*'/>
      </label>
    </div>
    <div id='overlay-options' >
      <div class='options' id='overlay-tilesheet-name'>
        Name: <input class='input--dim' id='overlay-name' placeholder='Name' type='text' />
      </div>
      <div class='settings-container overlay-options-container'>
        <h3>Size</h3>
        <div class='options'>
          W: <input class='input--dim' value='32' min='2' max='512' type='number' id='overlay-width'/><br />
          H: <input class='input--dim' value='32' min='2' max='512' type='number' id='overlay-height'/>
        </div>
      </div>
      <div class='settings-container overlay-options-container'>
        <h3>Offset</h3>
        <div class='options'>
          X: <input class='input--dim' value='0' min='0' max='512' type='number' id='overlay-offsetx'/><br />
          Y: <input class='input--dim' value='0' min='0' max='512' type='number' id='overlay-offsety'/>
        </div>
      </div>
      <div class='settings-container overlay-options-container'>
        <h3>Margin</h3>
        <div class='options'>
          X: <input class='input--dim' value='0' min='0' max='512' type='number' id='overlay-marginx'/><br />
          Y: <input class='input--dim' value='0' min='0' max='512' type='number' id='overlay-marginy'/>
        </div>
      </div>
    </div>
    <div id='overlay-buttons'>
      <button class='button--inactive' id='button--upload'>Upload</button>
      <button class='button--active' id='button--cancel'>Cancel</button>
    </div>
  `
}


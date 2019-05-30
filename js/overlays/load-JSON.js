export default function createLoadJSONOverlay() {
  return `
    <div id='overlay-load-file'>
      <div id='file-loaded'>No file selected...</div>
      <label class='label--file-loader button--active' for='input--load-JSON'>
        Choose File
        <input id='input--load-JSON' type='file' accept='.json'/>
      </label>
    </div>
    <div id='overlay-buttons'>
      <button class='button--inactive' id='button--upload-JSON'>Upload</button>
      <button class='button--active' id='button--cancel'>Cancel</button>
    </div>
  `
}

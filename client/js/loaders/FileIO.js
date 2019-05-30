import createLoadJSONOverlay from '../overlays/load-JSON.js';
import {loadJSON} from '../loaders/loaders.js';

export default class FileIO {
  constructor(tsManager, level, settings) {
    this.import = document.getElementById('import');
    this.export = document.getElementById('export');

    this.loadOverlay = createLoadJSONOverlay();

    this.import.onclick = event => {
      this.showOverlay(this.loadOverlay);
    }

    this.export.onclick = event => {
      this.saveJSON(tsManager, level, settings);
    }
  }

  showOverlay(html) {
    document.getElementById('overlay').style.visibility = 'visible';
    document.getElementById('overlay-container').innerHTML = html;

    const uploadButton = document.getElementById('button--upload-JSON');
    const fileLoadedDiv = document.getElementById('file-loaded');
    document.getElementById('button--cancel').onclick = event => {
      document.getElementById('overlay').style.visibility = 'hidden';
      document.getElementById('overlay-container').innerHTML = '';
    }
    uploadButton.onclick = event => {
      if (uploadButton.className === 'button--active') {
        loadJSON()
        .then(json => {
          uploadButton.className = 'button--inactive';
          document.getElementById('overlay').style.visibility = 'hidden';
          this.loadJSON(json);
        });
      }
    }
    document.getElementById('input--load-JSON').addEventListener('change', event => {
      const file = document.querySelector('input[type=file]').files[0];

      if (file) {
        fileLoadedDiv.innerHTML = file.name;
        uploadButton.className = 'button--active';
      }
    });
  }

  loadJSON(json) {
    console.log(json);
  }

  saveJSON(tilesheetManager, level, settings) {
    const exportObj = {
      tilesheets: tilesheetManager.toJSON(),
      level: level.toJSON(),
      settings: settings.toJSON(),
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", 'test' + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

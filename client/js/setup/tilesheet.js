import {Tilesheet, TilesheetManager} from '../sprites/Tilesheet.js';
import {loadImage} from '../loaders/loaders.js';
import Vector2 from '../math/Vector2.js';
import createLoadTilesheetOverlay from '../overlays/load-image.js';

export default function setupTilesheet() {
  const tilesheetInfoDisplay = {
    tileSize: {
      x: document.getElementById('tilesheet-width'),
      y: document.getElementById('tilesheet-height'),
    },
    offset: {
      x: document.getElementById('tilesheet-offsetx'),
      y: document.getElementById('tilesheet-offsety')
    },
    margin: {
      x: document.getElementById('tilesheet-marginx'),
      y: document.getElementById('tilesheet-marginy')
    }
  }
  tilesheetInfoDisplay.update = function(tileSize, offset, margin) {
    this.tileSize.x.value = tileSize.x;
    this.tileSize.y.value = tileSize.y;
    this.offset.x.value = offset.x;
    this.offset.y.value = offset.y;
    this.margin.x.value = margin.x;
    this.margin.y.value = margin.y;
  }

  const tilesheetManager = new TilesheetManager();
  ['tileSize', 'offset', 'margin'].forEach(prop => {
    ['x', 'y'].forEach(axis => {
      tilesheetInfoDisplay[prop][axis].onchange = () => {
        if (!tilesheetManager.activeSheet) {
          return;
        }
        tilesheetManager.activeSheet.redraw = true;

        tilesheetManager.activeSheet[prop][axis] = tilesheetInfoDisplay[prop][axis].value;
      }
    });
  });

  const load_image_html = createLoadTilesheetOverlay();
  const buttonLoadTileSheet = document.getElementById('button--load-tilesheet');
  buttonLoadTileSheet.onclick = event => {
    document.getElementById('overlay').style.visibility = 'visible';
    document.getElementById('overlay-container').innerHTML = load_image_html;
    const uploadButton = document.getElementById('button--upload');
    const cancelButton = document.getElementById('button--cancel');
    const fileLoadedDiv = document.getElementById('file-loaded');
    uploadButton.onclick = event => {
      if (uploadButton.className === 'button--active') {
        loadImage()
        .then(image => {
          uploadButton.className = 'button--inactive';
          const name = document.getElementById('overlay-name').value;
          const tileSize = new Vector2(
            parseInt(document.getElementById('overlay-width').value),
            parseInt(document.getElementById('overlay-height').value)
          );
          const offset = new Vector2(
            parseInt(document.getElementById('overlay-offsetx').value),
            parseInt(document.getElementById('overlay-offsety').value)
          );
          const margin = new Vector2(
            parseInt(document.getElementById('overlay-marginx').value),
            parseInt(document.getElementById('overlay-marginy').value)
          );

          const tilesheet = new Tilesheet(image, name, tileSize, offset, margin);
          tilesheet.setRatio(document.getElementById('canvas--tilesheet'));

          const div = document.createElement('div');
          div.id = tilesheet.name;
          div.innerHTML = tilesheet.name;
          div.onclick = event => {
            tilesheetManager.setActiveSheet(div.id);
            tilesheetInfoDisplay.update(tilesheet.tileSize, tilesheet.offset, tilesheet.margin);
            tilesheetManager.clearSelection();
          }

          document.getElementById('tilesheet-selection-container').appendChild(div);

          tilesheet.div = div;

          tilesheetInfoDisplay.update(tileSize, offset, margin);

          document.getElementById('overlay').style.visibility = 'hidden';
          tilesheetManager.loading = false;
          tilesheetManager.addTilesheet(tilesheet);
        });
      }
    }
    cancelButton.onclick = event => {
      document.getElementById('overlay').style.visibility = 'hidden';
      tilesheetManager.loading = false;
    }
    document.getElementById('input--load-tilesheet').addEventListener('change', event => {
      const file = document.querySelector('input[type=file]').files[0];

      if (file) {
        fileLoadedDiv.innerHTML = file.name;
        document.getElementById('overlay-name').value = file.name.substring(0, file.name.length - 4);
        document.getElementById('overlay-options').style.display = 'block';
        uploadButton.className = 'button--active';
      }
    });

    fileLoadedDiv.innerHTML = 'No file chosen...';
    uploadButton.className = 'button--inactive';
    tilesheetManager.loading = true;
  }
  buttonLoadTileSheet.onmouseover = event => {
    buttonLoadTileSheet.innerHTML = 'Load Tilesheet';
  }
  buttonLoadTileSheet.onmouseout = event => {
    buttonLoadTileSheet.innerHTML = '+';
  }

  return tilesheetManager;
}

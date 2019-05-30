const reader = new FileReader();

export function loadImage(){
  return new Promise(resolve => {
    const file = document.querySelector('input[type=file]').files[0];
    let image = new Image();

    reader.onloadend = function () {
      image.src = reader.result;
      image.name = file.name;
      resolve(image);
    }

    if (file) {
      reader.readAsDataURL(file);
    } else {
      image.src = "";
    }    
  });
}

export function loadJSON() {
  return new Promise(resolve => {
    const file = document.querySelector('input[type=file]').files[0];

    reader.onload = function (e) {
      const result = JSON.parse(e.target.result);
      const formatted = JSON.stringify(result, null, 2);
      resolve(formatted);
    }

    if (file) {
      reader.readAsText(file);
    }
  });
}

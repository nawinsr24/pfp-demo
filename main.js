const counts = {
  bg: 7,
  body: 25,
  head: 25,
  eye: 25,
  eyeMask: 15,
  hand: 25,
  mouth: 25,
};

const selectedItems = {
  bg: 2,
  body: 1,
  head: 1,
  eye: 3,
  eyeMask: 1,
  hand: 1,
  mouth: 3,
};

window.onload = async function () {
  // Initialize main image and event listeners after the DOM is fully loaded
  await setMainImage();
  initializeEventListeners();
  showGallery("bg");
  adjustHeightAndScroll();
  setdownload();
};

function setdownload() {
  document
    .getElementById("download-btn")
    .addEventListener("click", function () {
      // Get the div element
      const element = document.getElementById("content");

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size to match the div's dimensions
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;

      // Convert the div to an image and draw it on the canvas
      html2canvas(element).then(function (canvas) {
        // Get the data URL in JPEG format
        const dataURL = canvas.toDataURL("image/jpeg");

        // Create a download link
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "panda.jpeg";

        // Trigger the download
        link.click();
      });
    });

  document.getElementById("rg").addEventListener("click", function () {
    setRgen();
  });
}

async function setMainImage() {
  const images = await getArrayOrder(selectedItems);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const imgElements = await loadImages(images);

  canvas.width = imgElements[0].width;
  canvas.height = imgElements[0].height;

  imgElements.forEach((img) => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });

  const combinedImageSrc = canvas.toDataURL("image/png");
  document.getElementById("combined-image").src = combinedImageSrc;
}

async function getArrayOrder(data) {
  return [
    `assets/bg/${data.bg}.png`,
    `assets/hand/${data.hand}.png`,
    `assets/body/${data.body}.png`,
    `assets/head/${data.head}.png`,
    // `assets/eye-mask/${data.eyeMask}.png`,
    `assets/eye/${data.eye}.png`,
    `assets/mouth/${data.mouth}.png`,
  ];
}

async function loadImages(srcArray) {
  const imgElements = srcArray.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  await Promise.all(
    imgElements.map(
      (img) =>
        new Promise((resolve) => {
          img.onload = resolve;
        })
    )
  );

  return imgElements;
}

function initializeEventListeners() {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", function () {
      const targetGallery = button.getAttribute("data-target");
      showGallery(targetGallery);
    });
  });
}
let loading = false;
let selectedClass = "";
function showGallery(galleryClass) {
  console.log(loading, selectedClass, galleryClass);

  if (loading || selectedClass == galleryClass) return;
  selectedClass = galleryClass;

  loading = true;
  const galleries = document.querySelectorAll(".gallery");
  galleries.forEach((gallery) => {
    gallery.style.display = "none";
    gallery.replaceChildren();
  });

  const buttons = document.querySelectorAll(".nav-link");
  buttons.forEach((e) => {
    e.classList.remove("active");
  });

  const selectedGallery = document.querySelector(`.${galleryClass}`);
  selectedGallery.style.display = "block";
  const element = document.querySelector(`[data-target=${galleryClass}]`);
  element.classList.add("active");

  createPhotoDivs(selectedGallery, galleryClass);
}

async function createPhotoDivs(gallery, gclass) {
  gallery.replaceChildren();

  const numberOfPhotos = counts[gclass];
  const promises = [];

  for (let i = 0; i < numberOfPhotos; i++) {
    let array = [];

    switch (gclass) {
      case "bg":
        array = [`assets/bg/${i + 1}.png`];
        break;
      case "body":
        array = [
          `assets/bg/${selectedItems.bg}.png`,
          `assets/body/${i + 1}.png`,
          `assets/head/${selectedItems.head}.png`,
          // `assets/eye-mask/1.png`,
          `assets/hand/${selectedItems.hand}.png`,
          `assets/eye/${selectedItems.eye}.png`,
          `assets/mouth/${selectedItems.mouth}.png`,
        ];
        break;
      case "hand":
      case "eye":
      case "mouth":
      case "head":
        array = [
          `assets/bg/${selectedItems.bg}.png`,
          `assets/body/${selectedItems.body}.png`,
          `assets/head/${gclass === "head" ? i + 1 : selectedItems.head}.png`,
          // `assets/eye-mask/1.png`,
          `assets/hand/${gclass === "hand" ? i + 1 : selectedItems.hand}.png`,
          `assets/eye/${gclass === "eye" ? i + 1 : selectedItems.eye}.png`,
          `assets/mouth/${
            gclass === "mouth" ? i + 1 : selectedItems.mouth
          }.png`,
        ];
        break;
    }
    console.log(array);

    const promise = getImgSrc(array).then((imgSrc) => {
      const photoDiv = document.createElement("div");
      photoDiv.classList.add("photoDiv");

      const img = document.createElement("img");
      img.src = imgSrc;
      photoDiv.appendChild(img);

      photoDiv.addEventListener("click", function () {
        photoClicked(gclass, i);
      });

      gallery.appendChild(photoDiv);
    });

    promises.push(promise);
  }

  await Promise.all(promises);
  loading = false;
}

function photoClicked(type, index) {
  alert(type)
  selectedItems[type] = index + 1;
  setMainImage();
}

async function getImgSrc(images) {
  const imgElements = await loadImages(images);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = imgElements[0].width;
  canvas.height = imgElements[0].height;

  imgElements.forEach((img) => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  });

  return canvas.toDataURL("image/png");
}

function adjustHeightAndScroll() {
  const element = document.getElementById("gid");

  element.style.height = `${element.offsetHeight}px`;
  element.style.overflowY = "auto";
}

function setRgen() {
  function rg(maxValue) {
    return Math.floor(Math.random() * maxValue) + 1;
  }
  selectedItems.bg = rg(counts.bg);
  selectedItems.body = rg(counts.body);
  selectedItems.head = rg(counts.head);
  selectedItems.eye = rg(counts.eye);
  selectedItems.mouth = rg(counts.mouth);
  selectedItems.hand = rg(counts.hand);

  setMainImage();
}

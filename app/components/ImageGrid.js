const Modal = require('./Modal');

class ImageGrid {
  constructor() {
    this.gridElement = document.querySelector('#imagegrid');
    this.images = [];
  }

  _formatDateFromMs(ms) {
    const date = new Date(ms);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours ? hours : 12; // Hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes; // 0-pad the single digits

    const strTime = `${hours}:${minutes}`;

    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}  ${strTime}`;
  }

  _storeAndSortImages(images) {
    // Insert the new images into the array of existing ones
    this.images = this.images.concat(images);

    // Sort existing (stored) images by the upload date
    this.images.sort((a, b) => {
      const aDate = new Date(a.data.uploadDate);
      const bDate = new Date(b.data.uploadDate);
      return bDate - aDate;
    });
  }

  _setImageEventHandlers(imgNode) {
    imgNode.addEventListener('click', () => {
      Modal.render('image', { 'src': imgNode.src });
    });

    imgNode.addEventListener('load', () => {
      imgNode.classList.add('fade-in');
    });
  }

  _buildImageElement(imageData) {
    const { gridName, responsiveUrl, uploadDate, captureDate } = imageData.data;
    const { model, make } = imageData.data.imageMeta
      ? imageData.data.imageMeta
      : { model: "Not specified", make: "Not specified" };

    const imgNode = document.createElement('img');
    imgNode.classList.add('image');
    imgNode.src = `https://${responsiveUrl}`;
    this._setImageEventHandlers(imgNode);

    const infoNode = document.createElement('div');
    infoNode.classList.add('info-container');

    // Create text for all the info nodes below the image
    const infoNodesText = [
      gridName,
      `Uploaded ${this._formatDateFromMs(uploadDate)}`,
      //`Capture date: ${this._formatDateFromMs(captureDate)}`,
      `Camera: ${model} from ${make}`
    ];
    // Create nodes for all the infoNodesText and append them to the infoNode
    infoNodesText.forEach(node => {
      const textNode = document.createElement('span');
      textNode.classList.add('info-text');
      textNode.textContent = node;
      infoNode.appendChild(textNode);
    });

    const containerNode = document.createElement('div');
    containerNode.classList.add('image-container');
    // Append image and info-node to the container and return it
    [imgNode, infoNode].forEach(node => containerNode.appendChild(node));
    return containerNode;
  }

  render(images) {
    this._storeAndSortImages(images);
    // Here we use documentfragment as a container to which we can append all
    // the image nodes as they are made. This will increase performance
    // significantly, as it reduces the document reflow calculations
    // (document flow re-calculations)
    const container = document.createDocumentFragment();

    // Loop through each image dataset and build image nodes from the data
    for (let imageData of this.images) {
      container.appendChild(this._buildImageElement(imageData));
    }

    // Clear the DOM and insert all the new nodes
    const grid = this.gridElement;
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    grid.appendChild(container);
  }
}

module.exports = new ImageGrid();
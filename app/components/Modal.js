import fs from 'fs';
import path from 'path';
import React, { Component } from 'react';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.visible,
      userNames: []
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  getUsernames() {
    const userNames = fs.readFileSync(path.join(__dirname, '../usernames.json'), 'utf8');
    const namesArr = JSON.parse(userNames);
    return namesArr.names;
  }

  handleAddNewUser() {/*
    const handler = () => {
      const userInput = inputNode.value.trim();

      // Don't execute any further if the name was whitespace or empty
      if (!userInput) {
        inputNode.value = '';
        return;
      };

      // Read and parse the stored names
      const userNames = fs.readFileSync(path.join(__dirname, '../usernames.json'), 'utf8');
      let namesArr = JSON.parse(userNames).names;

      // If the name already exists in the list, exit function
      if (namesArr.includes(userInput)) {
        inputNode.value = '';
        return;
      }

      // Insert the new name
      namesArr.push(userInput);

      // Write the new object to the file
      const obj = { names: namesArr };
      fs.writeFileSync(path.join(__dirname, '../usernames.json'), JSON.stringify(obj));

      // Visually update with the new name as a list item
      const itemNode = this._buildUserNode(userInput, listNode);
      listNode.appendChild(itemNode);
      inputNode.value = '';
    }

    sendNode.addEventListener('click', () => handler());
    inputNode.addEventListener('keyup', e => {
      if (e.key === 'Enter') handler();
    });*/
  }

  toggleModal(e) {
    const newState = !this.state.isVisible;

    // Only toggle modal if user clicks on the same element that the listener is
    // attached to
    if (e.currentTarget === e.target) {
      this.setState({ isVisible: newState });
    }
  }

  handleRemoveUser() {
    //
  }

  render() {
    const templates = {
      settings: <div className="modal-bg" onClick={this.toggleModal}>
        <div className="modal-settings-container">
          <div className="settings-topbar"></div>
          <div className="settings-content">
            <h1>Usernames</h1>
            <h4>Add or remove usernames from the list</h4>
            <ul className="users-list scrollbar">{
              this.state.userNames.map((name, index) => {
                return (<li className="user" key={"username" + index}>
                  <span className="user-name">{name}</span>
                  <img
                    className="btn-remove"
                    src="./images/sharp_clear_white_48dp.png"
                    onClick={this.handleRemoveUser}
                  />
                </li>)
              })
            }</ul>
            <input className="user-add" type="text" placeholder="Add a new user" />
            <img className="btn-send" src="images/sharp_send_white_48dp.png" />
          </div>
        </div>
      </div>,
      image: <div>Img</div>
    };

    const visible = this.state.isVisible;
    const type = this.props.type;
    // If the component is visible, render using the correct template (specified
    // using type coming from props)
    return ((visible && type) ? templates[type] : null);
  }

  componentDidMount() {
    const userNames = this.getUsernames();
    this.setState({ userNames: userNames });
  }
}

/*
constructor() {
    this.modalElement = document.querySelector('#modal');
    this.modalNode = null;
  }

  _downloadHandler(src) {
    const download = require('image-downloader');
    const { dialog } = require('electron').remote;

    const targetLocation = dialog.showOpenDialog({
      properties: ['openDirectory'],
      buttonLabel: 'Save'
    });

    if (targetLocation) {
      download.image({ url: src, dest: targetLocation[0] })
        .then(({ filename, image }) => {
          // success
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  }

  _buildDownloadButton(src) {
    const downloadNode = document.createElement('button');
    downloadNode.classList.add('btn-download');
    downloadNode.textContent = 'Download Image';

    downloadNode.addEventListener('click', e => {
      e.stopPropagation();
      this._downloadHandler(src);
    });

    return downloadNode;
  }

  _buildBackground() {
    const bgNode = document.createElement('div');
    bgNode.classList.add('modal-bg');

    bgNode.addEventListener('click', e => {
      // Only close modal if user clicks on the background itself
      if (e.currentTarget === e.target) {
        this.modalNode = null;
        this.render();
      }
    });

    return bgNode;
  }

  _buildImage(image) {
    const imageNode = document.createElement('img');
    imageNode.classList.add('modal-image');
    imageNode.src = image.src;

    imageNode.addEventListener('click', e => {
      e.stopPropagation();
      this.modalNode = null;
      this.render();
    });

    return imageNode;
  }

  _buildImageModal(image) {
    const imageNode = this._buildImage(image);

    const downloadNode = this._buildDownloadButton(image.src);

    const containerNode = document.createElement('div');
    containerNode.classList.add('modal-image-container');
    [imageNode, downloadNode].forEach(node => containerNode.appendChild(node));

    const bgNode = this._buildBackground();
    bgNode.appendChild(containerNode);

    return bgNode;
  }

  _removeUserHandler(nameNode, removeNode, listNode, itemNode) {
    removeNode.addEventListener('click', () => {
      // Read and parse the stored names
      const userNames = fs.readFileSync(path.join(__dirname, '../usernames.json'), 'utf8');
      const namesArr = JSON.parse(userNames).names;

      // Filter out the one that was deleted by returning false when it hits
      const newNamesArr = namesArr.filter(elem => {
        return elem === nameNode.textContent ? false : true;
      });

      // Write the new object to the file
      const obj = { names: newNamesArr };
      fs.writeFileSync(path.join(__dirname, '../usernames.json'), JSON.stringify(obj));

      // Visually remove the object
      listNode.removeChild(itemNode);
    });
  }

  _buildUserNode(name, listNode) {
    const nameNode = document.createElement('span');
    nameNode.classList.add('user-name');
    nameNode.textContent = name;

    const removeNode = document.createElement('img');
    removeNode.classList.add('btn-remove');
    removeNode.src = './images/sharp_clear_white_48dp.png';

    const itemNode = document.createElement('li');
    itemNode.classList.add('user');
    [nameNode, removeNode].forEach(node => itemNode.appendChild(node));

    // Manages how a username is deleted from the list
    this._removeUserHandler(nameNode, removeNode, listNode, itemNode);

    return itemNode;
  }

  _buildUsersList() {
    const listNode = document.createElement('ul');
    listNode.classList.add('users-list', 'scrollbar');

    const userNames = fs.readFileSync(path.join(__dirname, '../usernames.json'), 'utf8');
    const namesArr = JSON.parse(userNames);

    for (let name of namesArr.names) {
      const itemNode = this._buildUserNode(name, listNode);
      listNode.appendChild(itemNode);
    }

    return listNode;
  }

  _addNewUserHandler(inputNode, sendNode, listNode) {
    const handler = () => {
      const userInput = inputNode.value.trim();

      // Don't execute any further if the name was whitespace or empty
      if (!userInput) {
        inputNode.value = '';
        return;
      };

      // Read and parse the stored names
      const userNames = fs.readFileSync(path.join(__dirname, '../usernames.json'), 'utf8');
      let namesArr = JSON.parse(userNames).names;

      // If the name already exists in the list, exit function
      if (namesArr.includes(userInput)) {
        inputNode.value = '';
        return;
      }

      // Insert the new name
      namesArr.push(userInput);

      // Write the new object to the file
      const obj = { names: namesArr };
      fs.writeFileSync(path.join(__dirname, '../usernames.json'), JSON.stringify(obj));

      // Visually update with the new name as a list item
      const itemNode = this._buildUserNode(userInput, listNode);
      listNode.appendChild(itemNode);
      inputNode.value = '';
    }

    sendNode.addEventListener('click', () => handler());
    inputNode.addEventListener('keyup', e => {
      if (e.key === 'Enter') handler();
    });
  }

  _buildUserInput(usersListNode) {
    const inputNode = document.createElement('input');
    inputNode.classList.add('user-add');
    inputNode.type = 'text';
    inputNode.placeholder = 'Add a new user';

    const sendNode = document.createElement('img');
    sendNode.classList.add('btn-send');
    sendNode.src = 'images/sharp_send_white_48dp.png';

    this._addNewUserHandler(inputNode, sendNode, usersListNode);

    return [inputNode, sendNode];
  }

  _buildSettingsContent() {
    const titleNode = document.createElement('h1');
    titleNode.textContent = 'Usernames';

    const underTitleNode = document.createElement('h4');
    underTitleNode.textContent = 'Add or remove usernames from the list';

    const usersListNode = this._buildUsersList();

    const userInputNodes = this._buildUserInput(usersListNode);

    return [titleNode, underTitleNode, usersListNode, usersListNode, ...userInputNodes];
  }

  _buildSettingsModal() {
    const topbarNode = document.createElement('div');
    topbarNode.classList.add('settings-topbar');

    const contentNode = document.createElement('div');
    contentNode.classList.add('settings-content');
    const settingsNodes = this._buildSettingsContent();
    settingsNodes.forEach(node => contentNode.appendChild(node));

    const containerNode = document.createElement('div');
    containerNode.classList.add('modal-settings-container');
    [topbarNode, contentNode].forEach(node => containerNode.appendChild(node));

    const bgNode = this._buildBackground();
    bgNode.appendChild(containerNode);

    return bgNode;
  }

  // Render can be called with no parameters to clear the current modal content
  // (which effectively removes it from the screen)
  render(type, dataObject = null) {
    if (type === 'image' && dataObject) {
      this.modalNode = this._buildImageModal(dataObject);
    } else if (type === 'settings') {
      this.modalNode = this._buildSettingsModal();
    } else {
      this.modalNode = null;
    }

    // Render the modal if the node exists, if not, it is just removed
    const modal = this.modalElement;
    while (modal.firstChild) modal.removeChild(modal.firstChild);

    if (this.modalNode !== null) {
      modal.appendChild(this.modalNode);
    }
  }
*/
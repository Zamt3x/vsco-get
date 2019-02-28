const Modal = require('./Modal');

class Menubar {
  constructor() {
    this.menuElement = document.querySelector('#menubar');
    this._render();
  }

  _reloadHandler(reloadNode) {
    const win = require('electron').remote.getCurrentWindow();
    reloadNode.addEventListener('click', () => win.reload());
  }

  _settingsHandler(settingsNode) {
    settingsNode.addEventListener('click', () => {
      Modal.render('settings');
    });
  }

  _render() {
    const reloadNode = document.createElement('img');
    reloadNode.classList.add('icon');
    reloadNode.src = 'images/sharp_replay_white_48dp.png';
    reloadNode.title = 'Reload the application';
    this._reloadHandler(reloadNode);

    const settingsNode = document.createElement('img');
    settingsNode.classList.add('icon');
    settingsNode.src = 'images/sharp_settings_white_48dp.png';
    settingsNode.title = 'Open the settings menu';
    this._settingsHandler(settingsNode);

    // Temporary container to trigger least possible document reflows
    const container = document.createDocumentFragment();
    [settingsNode, reloadNode].forEach(node => container.appendChild(node));

    this.menuElement.appendChild(container);
  }
}

module.exports = new Menubar();
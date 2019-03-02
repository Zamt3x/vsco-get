import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import React, { Component } from 'react';
import download from 'image-downloader';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNames: [],
      inputName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddNewUser = this.handleAddNewUser.bind(this);
    this.handleRemoveUser = this.handleRemoveUser.bind(this);
    this.handleDownloadImage = this.handleDownloadImage.bind(this);
  }

  getUsernames() {
    const data = fs.readFileSync(path.join(__dirname, '../usernames.json'), 'utf8');
    return JSON.parse(data).names;
  }

  handleAddNewUser() {
    const userInput = this.state['inputName'].trim();

    // Don't execute further if the name was whitespace, empty or already exists
    if (!userInput || this.state.userNames.includes(userInput)) {
      this.setState({ inputName: '' });
      return;
    }

    const newNames = this.state.userNames;
    newNames.push(userInput);

    // Save the new name (both state and usernames-file)
    this.saveUsers({ names: newNames });
    this.setState({ userInput: '' });
  }

  handleChange({ target }) {
    const { name, value } = target;

    if (name && this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleDownloadImage() {
    const targetLocation = remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      buttonLabel: 'Save'
    });

    if (targetLocation) {
      download.image({ url: this.props.src, dest: targetLocation[0] })
        .then(({ filename, image }) => {
          // success
        })
        .catch(err => {
          throw new Error(err);
        });
    }
  }

  handleRemoveUser(e) {
    const usn = e.target.getAttribute('data-username');

    // Filter out the one that was deleted by returning false when it hits
    const newNames = this.state.userNames.filter(name => name !== usn);
    this.saveUsers({ names: newNames });
  }

  saveUsers(obj) {
    // Save the new usernames to the usernames-file
    fs.writeFile(path.join(__dirname, '../usernames.json'), JSON.stringify(obj), (err) => {
      if (err) throw new Error(err);

      // Update the state to handle visual synchronization
      this.setState({ userNames: obj.names });
    });
  }

  render() {
    const templates = {
      settings: <div className="modal-settings-container">
        <div className="settings-topbar"></div>
        <div className="settings-content">
          <h1>Usernames</h1>
          <h4>Add or remove usernames from the list</h4>
          <ul className="users-list scrollbar">{
            this.state.userNames.map((name, index) => {
              return (
                <li className="user" key={"username" + index}>
                  <span className="user-name">{name}</span>
                  <img
                    className="btn-remove"
                    src="./images/sharp_clear_white_48dp.png"
                    data-username={name}
                    onClick={this.handleRemoveUser}
                  />
                </li>
              )
            })
          }</ul>
          <input
            className="user-add"
            name="inputName"
            type="text"
            placeholder="Add a new user"
            value={this.state.inputName}
            onChange={this.handleChange}
            onKeyUp={(e) => { if (e.key === 'Enter') this.handleAddNewUser(e) }}
          />
          <img
            className="btn-send"
            src="images/sharp_send_white_48dp.png"
            onClick={this.handleAddNewUser}
          />
        </div>
      </div>,
      image: <div className="modal-image-container">
        <img className="modal-image" src={this.props.src} />
        <button className="btn-download" onClick={this.handleDownloadImage}>Download Image</button>
      </div>
    };

    const { visible, type } = this.props;
    // If the component is visible, render using the correct template (specified
    // using the type from props)
    return (
      (visible && type)
        ? <div className="modal-bg" onClick={() => { this.props.modalToggle("settings", "close") }}>{templates[type]}</div>
        : null
    );
  }

  componentDidMount() {
    const userNames = this.getUsernames();
    this.setState({ userNames: userNames });
  }
}
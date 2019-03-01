import { remote } from 'electron';
import React, { Component } from 'react';

export default class Menubar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="menubar">
        <img className="icon" src="images/sharp_replay_white_48dp.png" title="Reload the application" onClick={() => remote.getCurrentWindow().reload()} />
        <img className="icon" src="images/sharp_settings_white_48dp.png" title="Open the settings menu" onClick={this.props.toggleModal} />
      </div>
    );
  }
}
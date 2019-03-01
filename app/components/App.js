import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Menubar from './Menubar';
import Modal from './Modal';

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false
    };

    this.handleModalToggle = this.handleModalToggle.bind(this);
  }

  handleModalToggle() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  render() {
    return (
      <div>
        <Menubar toggleModal={this.handleModalToggle} />
        <Modal type="settings" visible={this.state.modalVisible} toggleModal={this.handleModalToggle} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
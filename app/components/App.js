import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';
import Menubar from './Menubar';
import ImageGrid from './ImageGrid';

class App extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      modalType: '',
      modalSrc: ''
    };

    this.handleModalToggle = this.handleModalToggle.bind(this);
    this.switchModalSource = this.switchModalSource.bind(this);
  }

  handleModalToggle(type, state) {
    if (state === "open") {
      this.setState({
        modalVisible: true,
        modalType: type
      });
    } else if (state === "close") {
      this.setState({
        modalVisible: false,
        modalType: type
      });
    }
  }

  switchModalSource(src) {
    this.setState({ modalSrc: src });
  }

  render() {
    return (
      <div>
        <Modal
          type={this.state.modalType}
          visible={this.state.modalVisible}
          modalToggle={(type, state) => { this.handleModalToggle(type, state) }}
          src={this.state.modalSrc}
        />
        <Menubar
          modalToggle={(type, state) => { this.handleModalToggle(type, state) }}
        />
        <ImageGrid
          modalToggle={(type, state) => { this.handleModalToggle(type, state) }}
          switchModalSource={(src) => this.switchModalSource(src)}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
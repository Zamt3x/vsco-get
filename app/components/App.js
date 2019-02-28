import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Modal from './Modal';

class App extends Component {
  render() {
    return (
      <Modal type="settings" visible />
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
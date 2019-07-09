import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '@store/store';
import Homepage from '@components/Homepage/Homepage';

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <Homepage />
      </Provider>
    );
  }
}

export default App;

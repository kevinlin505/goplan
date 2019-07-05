import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '@store/store';

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <div>
          <h2>GoPlan</h2>
        </div>
      </Provider>
    );
  }
}

export default App;

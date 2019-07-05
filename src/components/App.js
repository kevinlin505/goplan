import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '@store/store';

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to React</h2>
            <div>testst</div>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </Provider>
    );
  }
}

export default App;

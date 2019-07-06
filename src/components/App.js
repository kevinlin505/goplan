import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '@store/store';
import SignIn from '@components/SignIn';

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <SignIn />
      </Provider>
    );
  }
}

export default App;

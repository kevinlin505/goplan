import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {HashRouter} from 'react-router-dom';
import configureStore from '@store/store';
import SignIn from '@components/SignIn/SignIn';
import UserPage from '@components/UserPage/UserPage';
import TripDetail from '@components/TripDetail/TripDetail';
import {AuthRoute, ProtectedRoute} from '@utils/router_util';

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <HashRouter>
          <AuthRoute path="/" exact component={SignIn} />
          <ProtectedRoute path="/home" component={UserPage} />
          <ProtectedRoute path="/trip/:tripId" component={TripDetail} />
        </HashRouter>
      </Provider>
    );
  }
}

export default App;

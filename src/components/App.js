import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Route, HashRouter } from 'react-router-dom';
import configureStore from '@store/store';
import { AuthRoute, ProtectedRoute } from '@utils/router_util';
import SignIn from '@components/SignIn/SignIn';
import UserPage from '@components/UserPage/UserPage';
import TripDetail from '@components/TripDetail/TripDetail';
import GlobalStyle from '@styles/GlobalStyle';

class App extends Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <GlobalStyle />
        <HashRouter>
          <AuthRoute component={SignIn} exact path="/" />
          <ProtectedRoute component={UserPage} path="/home" />
          <ProtectedRoute component={TripDetail} path="/trip/:tripId" />
        </HashRouter>
      </Provider>
    );
  }
}

export default App;

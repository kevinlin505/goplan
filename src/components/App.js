import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import configureStore from '@store/store';
import {
  AuthRoute,
  ProtectedRoute,
} from '@components/router-utils/RouterUtils';
import SignIn from '@components/auth/SignIn';
import UserPage from '@components/user-page/UserPage';
import TripDetail from '@components/trip-detail/TripDetail';
import theme from '@styles/theme/theme';
import GlobalStyle from '@styles/GlobalStyle';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={configureStore()}>
        <GlobalStyle />
        <HashRouter>
          <AuthRoute component={SignIn} exact path="/" />
          <ProtectedRoute component={UserPage} path="/home" />
          <ProtectedRoute component={TripDetail} path="/trip/:tripId" />
        </HashRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthState from '@constants/AuthState';
import AuthHandler from '@components/routers/auth-handler/AuthHandler';

export const AuthRoute = ({ auth, component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={({ location, ...renderProps }) => {
        return auth === AuthState.AUTHENTICATED ? (
          <Redirect
            to={(location.state && location.state.originalMatchUrl) || '/home'}
          />
        ) : (
          <Component {...renderProps} />
        );
      }}
    />
  );
};

AuthRoute.propTypes = {
  auth: PropTypes.number.isRequired,
  component: PropTypes.any.isRequired,
};

export const ProtectedRoute = ({ auth, component, ...props }) => {
  return (
    <Route
      {...props}
      render={renderProps => (
        <AuthHandler auth={auth} component={component} {...renderProps} />
      )}
    />
  );
};

ProtectedRoute.propTypes = {
  auth: PropTypes.number.isRequired,
  component: PropTypes.any.isRequired,
};

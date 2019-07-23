import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthHandler from '@components/routers/auth-handler/AuthHandler';

export const AuthRoute = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location, ...props }) => {
        return auth ? (
          <Redirect
            to={(location.state && location.state.originalMatchUrl) || '/home'}
          />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

AuthRoute.propTypes = {
  auth: PropTypes.number.isRequired,
  component: PropTypes.any.isRequired,
};

export const ProtectedRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => <AuthHandler component={component} {...props} />}
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

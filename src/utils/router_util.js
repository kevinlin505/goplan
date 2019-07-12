import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const mapStateToProps = state => {
  return {
    auth: !!(state.auth.isAuthenticated && state.auth.profile),
  };
};

const Auth = ({ component: Component, exact, path, auth }) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={props =>
        auth ? <Redirect to="/home" /> : <Component {...props} />
      }
    />
  );
};

const Protected = ({ component: Component, exact, path, auth }) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={props => (auth ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

export const AuthRoute = connect(mapStateToProps)(withRouter(Auth));

export const ProtectedRoute = connect(mapStateToProps)(withRouter(Protected));

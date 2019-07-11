import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const mapStateToProps = state => {
  return { auth: !!(state.auth.isAuthenticated && state.auth.profile) };
}

const Auth = ({ component: Component, exact, path, auth }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render={props => (auth ? <Redirect to='/home' /> : <Component {...props} />)}
    />
  )
}

const Protected = ({ component: Component, exact, path, auth }) => {
  return (
    <Route
      path={path}
      exact={exact}
      render={props => (auth ? <Component {...props} /> : <Redirect to='/' />)}
    />
  )
}

export const AuthRoute = withRouter(connect(mapStateToProps, null)(Auth));

export const ProtectedRoute = withRouter(connect(mapStateToProps, null)(Protected));
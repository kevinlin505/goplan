import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { tripActions } from '@providers/trip/trip';

const Auth = ({ auth, component: Component, exact, path }) => {
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

Auth.propTypes = {
  auth: PropTypes.bool.isRequired,
  component: PropTypes.any.isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
};

Auth.defaultProps = {
  exact: false,
};

const Protected = props => {
  const { exact, path } = props;
  return (
    <Route
      exact={exact}
      path={path}
      render={renderProps => {
        // using a connection component to get access to match in props,
        // withRouter only changes match variable after render is invoked
        return <RenderComp {...props} {...renderProps} />;
      }}
    />
  );
};

Protected.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.bool.isRequired,
  component: PropTypes.any.isRequired,
  exact: PropTypes.bool,
  match: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

Protected.defaultProps = {
  exact: false,
};

const RenderComp = props => {
  const { match, actions, auth, component: Component } = props;
  useEffect(() => {
    if (match.params.tripId) {
      actions.trip.updateInviteTripId(match.params.tripId);
    }
  }, []);
  return auth ? <Component {...props} /> : <Redirect to="/" />;
};

RenderComp.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  auth: PropTypes.bool.isRequired,
  component: PropTypes.any.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: !!(state.auth.isAuthenticated && state.auth.profile),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

export const AuthRoute = connect(mapStateToProps)(withRouter(Auth));

export const ProtectedRoute = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Protected));

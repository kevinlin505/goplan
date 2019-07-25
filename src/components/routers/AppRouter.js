import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HashRouter } from 'react-router-dom';
import { authActions } from '@providers/auth/auth';
import {
  AuthRoute,
  ProtectedRoute,
} from '@components/routers/router-utils/RouterUtils';
import SignIn from '@components/auth/SignIn';
import UserPage from '@components/user-page/UserPage';
import TripDetail from '@components/trips/trip-detail/TripDetail';
import googleApiFunc from '@utils/googleMapsApi';

const mapStateToProps = state => {
  return {
    auth: state.auth.isAuthenticated,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
    },
  };
};

const AppRouter = ({ actions, auth }) => {
  useEffect(() => {
    googleApiFunc();
    actions.auth.checkAuth();
  }, []);

  return (
    <HashRouter>
      <AuthRoute auth={auth} component={SignIn} exact path="/" />
      <ProtectedRoute component={UserPage} path="/home" />
      <ProtectedRoute component={TripDetail} path="/trip/:tripId" />
    </HashRouter>
  );
};

AppRouter.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.number.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppRouter);

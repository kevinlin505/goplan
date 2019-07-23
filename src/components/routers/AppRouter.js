import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { authActions } from '@providers/auth/auth';
import {
  AuthRoute,
  ProtectedRoute,
} from '@components/routers/router-utils/RouterUtils';
import SignIn from '@components/auth/SignIn';
import UserPage from '@components/user-page/UserPage';
import TripDetail from '@components/trips/trip-detail/TripDetail';

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
    actions.auth.checkAuth();
  }, []);

  return (
    <Router>
      <AuthRoute auth={auth} component={SignIn} exact path="/" />
      <ProtectedRoute component={UserPage} path="/home" />
      <ProtectedRoute component={TripDetail} path="/trip/:tripId" />
    </Router>
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

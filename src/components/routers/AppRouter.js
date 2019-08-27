import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HashRouter, Route } from 'react-router-dom';
import { authActions } from '@providers/auth/auth';
import googleMapsApi from '@utils/googleMapsApi';
import {
  AuthRoute,
  ProtectedRoute,
} from '@components/routers/router-utils/RouterUtils';
import SignIn from '@components/auth/SignIn';
import TripDetailRenderHandler from '@components/routers/component-handlers/TripDetailRenderHandler';
import UserPageRenderHandler from '@components/routers/component-handlers/UserPageRenderHandler';
import Privacy from '@components/PrivacyAndTerms/Privacy';
import Terms from '@components/PrivacyAndTerms/Terms';

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
    googleMapsApi();
    actions.auth.checkAuth();
  }, []);

  return (
    <HashRouter>
      <AuthRoute auth={auth} component={SignIn} exact path="/" />
      <ProtectedRoute
        auth={auth}
        component={UserPageRenderHandler}
        path="/home"
      />
      <ProtectedRoute
        auth={auth}
        component={TripDetailRenderHandler}
        path="/trip/:tripId"
      />
      <Route component={Privacy} exact path="/privacypolicy" />
      <Route component={Terms} exact path="/termsandconditions" />
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

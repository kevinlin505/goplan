import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import GoogleAuthButton from '@components/SignIn/GoogleAuthButton/GoogleAuthButton';

const SignIn = ({ actions, auth }) => {
  useEffect(() => {
    actions.auth.checkAuth();
  }, []);

  return (
    <div>
      <h2>GoPlan</h2>
      {auth.isAuthenticated ? (
        <button onClick={actions.auth.signOut}>Sign Out with Gmail</button>
      ) : (
        <GoogleAuthButton handleSignIn={actions.auth.signIn} />
      )}
    </div>
  );
};

SignIn.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default connect(
  state => {
    return {
      auth: state.auth,
    };
  },
  dispatch => {
    return {
      actions: {
        auth: bindActionCreators(authActions, dispatch),
      },
    };
  },
)(SignIn);

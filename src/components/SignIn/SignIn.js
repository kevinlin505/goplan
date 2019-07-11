import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import GoogleAuthButton from '@components/SignIn/AuthButton/GoogleAuthButton';
import FacebookAuthButton from '@components/SignIn/AuthButton/FacebookAuthButton';

const SignIn = ({ actions, auth }) => {
  useEffect(() => {
    actions.auth.checkAuth();
  }, []);

  return (
    <div>
      <h2>GoPlan</h2>
      <GoogleAuthButton handleSignIn={actions.auth.signInWithGoogleAuth} />
      <FacebookAuthButton handleSignIn={actions.auth.signInWithFacebookAuth} />
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

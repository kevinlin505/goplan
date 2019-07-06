import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as userActions } from '@providers/user/user';

const SignIn = ({ actions, user }) => {
  useEffect(() => {
    actions.
  }, []);

  return (
    <div>
      <h2>GoPlan</h2>
      {user.isAuthenticated ? (
        <button onClick={actions.user.signOut}>Sign Out with Gmail</button>
      ) : (
        <button onClick={actions.user.signIn}>Sign In with Gmail</button>
      )}
    </div>
  );
};

SignIn.propTypes = {
  actions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default connect(
  state => {
    return {
      user: state.user,
    };
  },
  dispatch => {
    return {
      actions: {
        user: bindActionCreators(userActions, dispatch),
      },
    };
  },
)(SignIn);

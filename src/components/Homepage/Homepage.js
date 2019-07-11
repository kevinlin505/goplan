import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignIn from '@components/SignIn/SignIn';
import UserPage from '@components/UserPage/UserPage';

const Homepage = ({ auth }) => {
  return (
    <div>
      <h2>GoPlan</h2>
      {auth.isAuthenticated && auth.profile ? <UserPage /> : <SignIn />}
    </div>
  );
};

Homepage.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default connect(state => {
  return {
    auth: state.auth,
  };
})(Homepage);

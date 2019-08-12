import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from '@components/loading/Loading';
import UserPage from '@components/user-page/UserPage';

const mapStateToProps = state => {
  return {
    profile: state.auth.profile,
  };
};

const UserPageRenderHandler = ({ profile }) => {
  if (!profile) {
    return <Loading />;
  }

  return <UserPage />;
};

UserPageRenderHandler.propTypes = {
  profile: PropTypes.object,
};

UserPageRenderHandler.defaultProps = {
  profile: null,
};

export default connect(mapStateToProps)(UserPageRenderHandler);

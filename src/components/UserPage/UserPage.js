import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import { tripActions } from '@providers/trip/trip';

const UserPage = ({ actions }) => {
  const handleCreateTrip = () => {
    actions.trip.createTrip({});
  };

  return (
    <div>
      <button onClick={actions.auth.signOut}>Sign Out with Gmail</button>
      <button onClick={handleCreateTrip}>Create Trip</button>
    </div>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
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
        trip: bindActionCreators(tripActions, dispatch),
      },
    };
  },
)(UserPage);

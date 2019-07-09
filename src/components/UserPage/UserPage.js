import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { authActions } from '@providers/auth/auth';
import { tripActions } from '@providers/trip/trip';

const UserPage = ({ actions, auth }) => {
  const handleCreateTrip = () => {
    actions.trip.createTrip({});
  };

  const tripDetails = useRef(null);

  const handleDisplayTrip = () => {
    const tripRef = auth.profile.trips[0];
    actions.trip.getTrip(tripRef);
  };

  return (
    <div>
      <button onClick={actions.auth.signOut}>Sign Out with Gmail</button>
      <button onClick={handleCreateTrip}>Create Trip</button>
      <button onClick={handleDisplayTrip}>Display Trip</button>
      <TripDetails ref={tripDetails}></TripDetails>
    </div>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const TripDetails = styled.div`
  background: #ededed;
  color: black;
`;

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

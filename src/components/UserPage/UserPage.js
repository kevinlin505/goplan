import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import { tripActions } from '@providers/trip/trip';
import TripCard from '@components/UserPage/TripCard/TripCard';

const UserPage = ({ actions, auth, trip }) => {
  const handleCreateTrip = () => {
    actions.trip.createTrip({});
  };

  const handleDisplayTrip = () => {
    const tripRef = auth.profile.trips[0];
    actions.trip.getTrip(tripRef);
  };

  const [tripList, setTripList] = useState(null);

  useEffect(() => {
    const tripRefs = auth.profile.trips;
    actions.trip.getAllTrips(tripRefs);
  }, [auth.profile.trips.length]);

  useEffect(() => {
    const trips = trip.trips.map((tripDetails, index) => {
      return (
        <TripCard
          key={`${tripDetails.name}-${index}`}
          tripDetails={tripDetails}
        />
      );
    });

    setTripList(trips);
  }, [trip.trips.length]);

  return (
    <div>
      <button onClick={actions.auth.signOut}>Sign Out with Gmail</button>
      <button onClick={handleCreateTrip}>Create Trip</button>
      <button onClick={handleDisplayTrip}>Display Trip</button>

      <TripList>{tripList}</TripList>
    </div>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
};

const TripList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default connect(
  state => {
    return {
      auth: state.auth,
      trip: state.trip,
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

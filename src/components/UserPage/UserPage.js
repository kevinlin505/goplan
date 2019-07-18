import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import { tripActions } from '@providers/trip/trip';
import { userActions } from '@providers/user/user';
import TripCard from '@components/UserPage/TripCard/TripCard';
import CreateTrip from '@components/UserPage/CreateTrip/CreateTrip';
import getTripStatus from '@selectors/tripSelector';

const mapStateToProps = state => {
  return {
    auth: state.auth,
    trip: state.trip,
    userInTrip: getTripStatus(state, state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
      user: bindActionCreators(userActions, dispatch),
    },
  };
};

const UserPage = ({ actions, auth, trip, userInTrip }) => {
  const [tripList, setTripList] = useState(null);
  const [isCreateTripModalOpen, setCreateTripModalOpen] = useState(false);

  const toggleCreateTripModal = () => {
    setCreateTripModalOpen(!isCreateTripModalOpen);
  };

  useEffect(() => {
    const { joinTripId } = trip;

    if (joinTripId && !userInTrip) {
      actions.trip.joinTrip(joinTripId, auth.profile);
    }
  }, []);

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
      <button onClick={actions.auth.signOut}>Sign Out</button>
      <button onClick={toggleCreateTripModal}>Create Trip</button>

      {isCreateTripModalOpen && (
        <CreateTrip toggleCreateTripModal={toggleCreateTripModal} />
      )}
      <TripList>{tripList}</TripList>
    </div>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

const TripList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPage);

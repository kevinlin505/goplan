import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import { userActions } from '@providers/user/user';
import TripCard from '@components/UserPage/TripCard/TripCard';
import NavigationBar from '@components/Navigation/NavigationBar';
import getTripStatus from '@selectors/tripSelector';
import Expense from '@components/UserPage/Expense/Expense';

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
      expense: bindActionCreators(expenseActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
      user: bindActionCreators(userActions, dispatch),
    },
  };
};

const UserPage = ({ actions, auth, trip, userInTrip }) => {
  const [tripList, setTripList] = useState(null);
  const tripCount =
    auth.profile && auth.profile.trips && auth.profile.trips.length;
  const tripIds = Object.keys(trip.trips);

  useEffect(() => {
    const { joinTripId } = trip;

    if (joinTripId && !userInTrip) {
      actions.trip.joinTrip(joinTripId);
    }

    actions.expense.getUserExpenseReports();
  }, []);

  useEffect(() => {
    const tripRefs = auth.profile.trips;
    actions.trip.getAllTrips(tripRefs);
  }, [tripCount]);

  useEffect(() => {
    const trips = tripIds.map((tripId, index) => {
      const tripDetail = trip.trips[tripId];

      return <TripCard key={`${tripId}-${index}`} tripDetail={tripDetail} />;
    });

    setTripList(trips);
  }, [tripIds.length]);

  return (
    <div>
      <NavigationBar signOut={actions.auth.signOut} />
      <Container>
        <Expense />
        <TripList>{tripList}</TripList>
      </Container>
    </div>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

const Container = styled.div`
  padding-top: 70px;
`;

const TripList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPage);

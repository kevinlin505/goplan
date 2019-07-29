import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import { userActions } from '@providers/user/user';
import TripCard from '@components/user-page/trip-card/TripCard';
import UserExpense from '@components/user-page/user-expense/UserExpense';
import ProfileCard from '@components/user-page/profile-card/ProfileCard';
import NewTripModal from '@components/trips/new-trip-modal/NewTripModal';

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.auth.profile,
    trip: state.trip,
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

const UserPage = ({ actions, auth, profile, trip }) => {
  const [tripList, setTripList] = useState(null);
  const tripCount = profile && profile.trips && profile.trips.length;
  const tripIds = Object.keys(trip.trips);

  useEffect(() => {
    actions.expense.getUserExpenseReports();
  }, []);

  useEffect(() => {
    if (tripCount !== Object.keys(trip.trips).length) {
      const tripRefs = auth.profile.trips;
      actions.trip.getAllTrips(tripRefs);
    }
  }, [tripCount]);

  useEffect(() => {
    const trips = tripIds.map((tripId, index) => {
      const tripDetail = trip.trips[tripId];

      return (
        <TripCard
          key={`${tripId}-${index}`}
          homePage={true}
          tripDetail={tripDetail}
        />
      );
    });

    setTripList(trips);
  }, [tripIds.length]);

  return (
    <Container>
      <Contents>
        <LeftPanel>
          <ProfileCard profile={profile} />
          <UserExpense />
        </LeftPanel>
        <MainPanel>
          <TripList>{tripList}</TripList>
        </MainPanel>
        <RightPanel>
          <div></div>
        </RightPanel>
      </Contents>
      {trip.isNewTripModalOpen && <NewTripModal />}
    </Container>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
};

const Container = styled.div`
  padding: 20px;
`;

const Contents = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.giant}px;
  margin: 0 auto;
`;

const LeftPanel = styled.div`
  width: 25%;
  padding: 15px;
`;

const MainPanel = styled.div`
  width: 50%;
  padding: 15px;
`;

const RightPanel = styled.div`
  width: 25%;
  padding: 15px;
`;

const TripList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPage);

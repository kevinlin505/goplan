import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authActions } from '@providers/auth/auth';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import { userActions } from '@providers/user/user';
import { getSortedTrips } from '@selectors/tripSelector';
import TripCard from '@components/user-page/trip-card/TripCard';
import UserExpense from '@components/user-page/user-expense/UserExpense';
import ProfileCard from '@components/user-page/profile-card/ProfileCard';

const mapStateToProps = state => {
  return {
    auth: state.auth,
    profile: state.auth.profile,
    sortedTrips: getSortedTrips(state),
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

const UserPage = ({ actions, auth, profile, sortedTrips, trip }) => {
  const tripCount = profile && profile.trips && profile.trips.length;

  useEffect(() => {
    actions.user.getUserExpenseReports();
  }, []);

  useEffect(() => {
    if (tripCount !== Object.keys(trip.trips).length) {
      const tripRefs = auth.profile.trips;
      actions.trip.getAllTrips(tripRefs);
    }
  }, [tripCount]);

  function constructCurrentTrips(section) {
    return sortedTrips[section].map((currentTrip, index) => {
      return (
        <TripCard
          key={`${currentTrip.id}-${index}`}
          homePage={true}
          tripDetail={currentTrip}
        />
      );
    });
  }

  return (
    <Container>
      <Contents>
        <LeftPanel>
          <ProfileCard actions={actions} profile={profile} />
          <UserExpense />
        </LeftPanel>
        <MainPanel>
          <TripList>
            {sortedTrips.current.length > 0 && (
              <div>{constructCurrentTrips('current')}</div>
            )}

            {sortedTrips.previous.length > 0 && (
              <div>
                <TripListLabel>Previous trips:</TripListLabel>
                {constructCurrentTrips('previous')}
              </div>
            )}
          </TripList>
        </MainPanel>
        <RightPanel>
          <div></div>
        </RightPanel>
      </Contents>
    </Container>
  );
};

UserPage.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  sortedTrips: PropTypes.object.isRequired,
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
  width: 300px;
`;

const MainPanel = styled.div`
  width: 550px;
  margin: 0 15px;
`;

const RightPanel = styled.div`
  width: 300px;
`;

const TripList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TripListLabel = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserPage);

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notification from '@constants/Notification';
import { authActions } from '@providers/auth/auth';
import { expenseActions } from '@providers/expense/expense';
import { notificationActions } from '@providers/notification/notification';
import { tripActions } from '@providers/trip/trip';
import { userActions } from '@providers/user/user';
import { getSortedTrips } from '@selectors/tripSelector';
import StatusNotification from '@components/status-notification/StatusNotification';
import TripCard from '@components/user-page/trip-card/TripCard';
import UserExpense from '@components/user-page/user-expense/UserExpense';
import ProfileCard from '@components/user-page/profile-card/ProfileCard';
import breakpointMin from '@styles/media';
import { flexbox } from '@material-ui/system';

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
      notification: bindActionCreators(notificationActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
      user: bindActionCreators(userActions, dispatch),
    },
  };
};

const UserPage = ({ actions, auth, profile, sortedTrips, trip }) => {
  const tripCount = profile.trips && profile.trips.length;

  useEffect(() => {
    if (!tripCount) {
      actions.notification.setNotification(
        Notification.INFORMATION,
        'To start your next vacation, create a trip and invite friends to join',
      );
    }

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
          <StatusNotification />
          <TripList>
            {sortedTrips.current.length > 0 && (
              <div>
                <TripListLabel>Current trips:</TripListLabel>
                {constructCurrentTrips('current')}
              </div>
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
  ${breakpointMin(
    'small',
    css`
      flex-direction: column;
      flex: 1 1 auto;
    `,
  )};
  ${breakpointMin(
    'medium',
    css`
      flex-direction: row;
      flex: 1 1 auto;
    `,
  )};
`;

const LeftPanel = styled.div`
  width: 300px;

  ${breakpointMin(
    'small',
    css`
      width: 100%;
    `,
  )};

  ${breakpointMin(
    'smallPlus',
    css`
      display: flex;
    `,
  )};

  ${breakpointMin(
    'medium',
    css`
      flex-direction: column;
      width: 35%;
      max-width: 300px;
    `,
  )};
`;

const MainPanel = styled.div`
  width: 550px;
  margin: 0 15px;
  ${breakpointMin(
    'small',
    css`
      width: 100%;
      margin: 0;
    `,
  )};
  ${breakpointMin(
    'medium',
    css`
      width: 65%;
      max-width: 650px;
      margin: 0 0 0 25px;
    `,
  )};
  ${breakpointMin(
    'large',
    css`
      max-width: 650px;
      margin: 0 0 0 25px;
    `,
  )};
`;

const RightPanel = styled.div`
  width: 300px;
  ${breakpointMin(
    'small',
    css`
      display: none;
    `,
  )};
  ${breakpointMin(
    'large',
    css`
      display: flex;
      width: 224px;
      max-width: 300px;
      display: none;
    `,
  )};
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

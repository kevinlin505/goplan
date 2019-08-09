import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, withStyles } from '@material-ui/core';
import { expenseActions } from '@providers/expense/expense';
import { tripActions } from '@providers/trip/trip';
import { getParamTripId, getTripStatus } from '@selectors/tripSelector';
import googleMapsApi from '@utils/googleMapsApi';
import validateEmail from '@utils/validateEmail';
import getTravelDates from '@utils/calculateTravelDates';
import TripMembers from '@components/trips/trip-detail/trip-members/TripMembers';
import TripMap from '@components/trips/trip-detail/trip-map/TripMap';
import TripExpenseSummary from '@components/trips/trip-detail/trip-expense/TripExpenseSummary';
import TripExpenseDetails from '@components/trips/trip-detail/trip-expense/TripExpenseDetails';
import NewExpenseModal from '@components/trips/trip-detail/new-expense-modal/NewExpenseModal';
import { Input } from '@styles/forms/Forms';
import CardContainer from '@styles/card/CardContainer';
import styles from '@styles/theme/theme';
import TripDestinations from './trip-destinations/TripDestinations';

const mapStateToProps = (state, props) => {
  return {
    selectedTrip: state.selectedTrip,
    tripId: getParamTripId(state, props),
    userInTrip: getTripStatus(state, props),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      expense: bindActionCreators(expenseActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const TripDetail = ({
  actions,
  classes,
  history,
  selectedTrip,
  tripId,
  userInTrip,
  match,
}) => {
  const [isExpenseModal, setExpenseModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const google = googleMapsApi();
  const showTripCard = selectedTrip && selectedTrip.id === match.params.tripId;
  const showTripMap = showTripCard && google;
  const tripStartDate = new Date(
    selectedTrip.travelDates.startAt,
  ).toLocaleDateString();
  const tripEndDate = new Date(
    selectedTrip.travelDates.endAt,
  ).toLocaleDateString();

  function toggleCreateExpenseModal() {
    setExpenseModal(prevExpenseModal => !prevExpenseModal);
  }

  function handleLeaveTrip() {
    actions.trip.leaveTrip(tripId).then(() => {
      history.push('/home');
    });
  }

  function handleInviteEmail(event) {
    setInviteEmail(event.target.value);
  }

  function handleInvite() {
    if (inviteEmail) {
      actions.trip.inviteTrip(
        inviteEmail,
        tripId,
        selectedTrip.name,
        getTravelDates(selectedTrip),
      );
      setInviteEmail('');
    }
  }

  useEffect(() => {
    setValidEmail(validateEmail(inviteEmail));
  }, [inviteEmail]);

  useEffect(() => {
    // actions.trip.getMembers(selectedTrip.members);
    actions.trip.getTripExpenses(selectedTrip.expenses);

    actions.trip.subscribeToTripChange(tripId);

    if (!userInTrip) {
      actions.trip.joinTrip(tripId);
    }

    return () => {
      actions.trip.unsubscribeToTripChange();
    };
  }, []);

  return (
    <Container>
      <Contents>
        <TopPanel>
          <TopLeftPanel>
            <CardContainer>
              <TripName>{selectedTrip && selectedTrip.name}</TripName>
              <TripDates>{`${tripStartDate} - ${tripEndDate}`}</TripDates>
              <Wrapper>
                <Input
                  label="Invite email"
                  onChange={handleInviteEmail}
                  value={inviteEmail}
                />
                <Button
                  className={classes.greyButton}
                  color="primary"
                  disabled={!validEmail}
                  onClick={handleInvite}
                  variant="contained"
                >
                  Invite
                </Button>
              </Wrapper>
              <Button
                className={classes.blueButton}
                color="primary"
                onClick={handleLeaveTrip}
                variant="contained"
              >
                Leave
              </Button>
              <Button
                className={classes.blueButton}
                color="primary"
                onClick={toggleCreateExpenseModal}
                variant="contained"
              >
                New Expense
              </Button>
            </CardContainer>
            <TripMembers members={selectedTrip.members} />
          </TopLeftPanel>
          <TopMiddlePanel>
            <CardContainer>
              {selectedTrip && selectedTrip.destinations && (
                <TripDestinations
                  actions={actions}
                  destinations={selectedTrip.destinations}
                />
              )}
            </CardContainer>
          </TopMiddlePanel>
          <TopRightPanel>
            {selectedTrip && (
              <CardContainer>
                <TripExpenseSummary totalExpense={selectedTrip.costs} />
              </CardContainer>
            )}
            {showTripMap && (
              <TripMap destinations={selectedTrip.destinations} />
            )}
          </TopRightPanel>
        </TopPanel>
        <BottomPanel>
          {selectedTrip && (
            <div>
              <TripExpenseDetailsHeader>
                Detail expense by receipts
              </TripExpenseDetailsHeader>
              <TripExpenseDetails totalExpense={selectedTrip.costs} />
            </div>
          )}
        </BottomPanel>
      </Contents>
      {isExpenseModal && (
        <NewExpenseModal toggleCreateExpenseModal={toggleCreateExpenseModal} />
      )}
    </Container>
  );
};

TripDetail.propTypes = {
  actions: PropTypes.object.isRequired,
  classes: PropTypes.any,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

const Container = styled.div`
  padding: 20px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.colossal}px;
  margin: 0 auto;
`;

const TopPanel = styled.div`
  display: flex;
  width: 100%;
  padding: 15px;
`;

const BottomPanel = styled.div`
  width: 100%;
  padding: 15px;
`;

const TopLeftPanel = styled.div`
  flex: 1 1 auto;
  width: 100%;
  max-width: 320px;
  padding: 15px 10px;
`;

const TopMiddlePanel = styled.div`
  flex: 1 1 auto;
  padding: 15px 10px;
`;

const TopRightPanel = styled.div`
  flex: 1 1 auto;
  width: 100%;
  min-width: 250px;
  max-width: 320px;
  padding: 15px 10px;
`;

const TripName = styled.div`
  font-size: 30px;
  margin: 8px 16px;
`;

const TripDates = styled.div`
  font-size: 18px;
  margin: 8px 16px;
`;

const Wrapper = styled.div`
  padding: 5px 0;
  margin: 5px 16px;
`;

const TripExpenseDetailsHeader = styled.div`
  font-size: 18px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(withRouter(TripDetail)));

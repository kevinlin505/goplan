import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { expenseActions } from '@providers/expense/expense';
import { userActions } from '@providers/user/user';
import { tripActions } from '@providers/trip/trip';
import {
  getAttendee,
  getParamTripId,
  getTripStatus,
} from '@selectors/tripSelector';
import googleMapsApi from '@utils/googleMapsApi';
import validateEmail from '@utils/validateEmail';
import TripMap from '@components/trips/trip-detail/trip-map/TripMap';
import TripExpense from '@components/trips/trip-detail/trip-expense/TripExpense';
import NewExpenseModal from '@components/trips/trip-detail/new-expense-modal/NewExpenseModal';
import TripTimeline from '@components/trips/trip-detail/trip-timeline/TripTimeline';
import { FieldWrapper, Input } from '@styles/forms/Forms';

const mapStateToProps = (state, props) => {
  return {
    attendee: getAttendee(state, props),
    trip: state.trip,
    tripId: getParamTripId(state, props),
    users: state.user.users,
    userInTrip: getTripStatus(state, props),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      expense: bindActionCreators(expenseActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
      user: bindActionCreators(userActions, dispatch),
    },
  };
};

const TripDetail = ({
  actions,
  attendee,
  history,
  trip,
  tripId,
  users,
  userInTrip,
  match,
}) => {
  const [isExpenseModal, setExpenseModal] = useState(false);
  const [expenseList, setExpenseList] = useState(null);
  const google = googleMapsApi();
  const showTripCard =
    trip.selectedTrip && trip.selectedTrip.id === match.params.tripId;
  const showTripMap = showTripCard && google;
  const toggleCreateExpenseModal = () => {
    setExpenseModal(!isExpenseModal);
  };

  useEffect(() => {
    actions.trip.getTrip(tripId).then(data => {
      actions.user.getAllAttendees(data.selectedTrip.attendees);
    });

    if (!userInTrip) {
      actions.trip.joinTrip(tripId);
    }
  }, []);

  useEffect(() => {
    if (trip.selectedTrip) {
      actions.trip.getTripExpenses(trip.selectedTrip.expenses);
      setExpenseList(trip.selectedTrip.expenses.map(ele => ele.id));
    }
  }, [trip.selectedTrip]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  useEffect(() => {
    setValidEmail(validateEmail(inviteEmail));
  }, [inviteEmail]);

  function handleInviteEmail(event) {
    setInviteEmail(event.target.value);
  }

  function handleInvite() {
    if (inviteEmail) {
      actions.trip.inviteTrip(inviteEmail, tripId);
      setInviteEmail('');
    }
  }

  function handleLeaveTrip() {
    actions.trip.leaveTrip(tripId, attendee).then(() => {
      history.push('/home');
    });
  }

  function renderAttendees() {
    let list = [];
    if (users && Object.keys(users).length) {
      list = trip.selectedTrip.attendees.map((key, idx) => {
        return (
          <TripAttendee key={`${key.id}-${idx}`}>
            <AttendeeName>{users[key.id].name}</AttendeeName>
            <AttendeeInfo>
              <AttendeePaymentInfo>
                <AttendeePaymentLabel>Venmo:</AttendeePaymentLabel>
                <div>{users[key.id].venmo}</div>
              </AttendeePaymentInfo>
              <AttendeePaymentInfo>
                <AttendeePaymentLabel>Quickpay:</AttendeePaymentLabel>
                <div>{users[key.id].quickpay}</div>
              </AttendeePaymentInfo>
            </AttendeeInfo>
          </TripAttendee>
        );
      });
    }

    return list;
  }

  // Need to clean up this part, we should not get into this component if selectedTrip is null.
  return (
    <Container>
      <Contents>
        <TopPanel>
          <TopLeftPanel>
            <TripDetailContainer>
              <TripName>{trip.selectedTrip && trip.selectedTrip.name}</TripName>
              <TripDates>
                {trip.selectedTrip &&
                  `${new Date(
                    trip.selectedTrip.travelDates.startAt,
                  ).toLocaleDateString()} - ${new Date(
                    trip.selectedTrip.travelDates.endAt,
                  ).toLocaleDateString()}`}
              </TripDates>
              <TripAttendeesList>
                Attendees
                {renderAttendees()}
              </TripAttendeesList>
            </TripDetailContainer>
            <FieldWrapper>
              <Input
                label="Invite email"
                onChange={handleInviteEmail}
                value={inviteEmail}
              />
              <Button
                color="primary"
                disabled={!validEmail}
                onClick={handleInvite}
                variant="contained"
              >
                Invite
              </Button>
            </FieldWrapper>
            <Button
              color="primary"
              onClick={handleLeaveTrip}
              variant="contained"
            >
              Leave
            </Button>
            <Button
              color="primary"
              onClick={toggleCreateExpenseModal}
              variant="contained"
            >
              New Expense
            </Button>
          </TopLeftPanel>
          <TopRightPanel>
            {trip.selectedTrip && TripTimeline(trip.selectedTrip.destinations)}
            {showTripMap && (
              <TripMap destinations={trip.selectedTrip.destinations} />
            )}
          </TopRightPanel>
        </TopPanel>
        <BottomPanel>
          {expenseList && (
            <TripExpense
              expenseList={expenseList}
              totalExpense={trip.selectedTrip.costs}
            />
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
  attendee: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object,
  trip: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  users: PropTypes.object,
  userInTrip: PropTypes.bool.isRequired,
};

TripDetail.defaultProps = {
  attendee: {},
  selectedTrip: null,
};

const Container = styled.div`
  padding: 20px;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.giant}px;
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
  width: 33%;
  padding: 15px;
`;

const TopRightPanel = styled.div`
  width: 66%;
  padding 15px;
`;

const TripDetailContainer = styled.div`
  width: 100%;
  margin: 0 15px;
`;

const TripName = styled.div`
  font-size: 30px;
  margin: 10px 0;
`;

const TripDates = styled.div`
  font-size: 18px;
  margin: 10px 0;
`;

const TripAttendeesList = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
`;

const TripAttendee = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  text-decoration: none;
`;

const AttendeeName = styled.div`
  font-size: 14px;
  font-weight: 500;
  min-width: 80px;
  text-decoration: none;
`;

const AttendeeInfo = styled.div`
  padding: 0 10px;
  text-decoration: none;
`;

const AttendeePaymentInfo = styled.div`
  line-height: 1.5em;
  display: flex;
`;

const AttendeePaymentLabel = styled.div`
  width: 80px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

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
import TripCard from '@components/user-page/trip-card/TripCard';
import TripMap from '@components/trips/trip-detail/trip-map/TripMap';
import TripExpense from '@components/trips/trip-detail/trip-expense/TripExpense';
import NewExpenseModal from '@components/trips/trip-detail/new-expense-modal/NewExpenseModal';
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

  // Need to clean up this part, we should not get into this component if selectedTrip is null.
  return (
    <Container>
      <Contents>
        <LeftPanel>
          {/* {showTripCard ? <TripCard tripDetail={trip.selectedTrip} /> : null} */}
          <div>
            <div>{trip.selectedTrip && trip.selectedTrip.name}</div>
            <div>
              {trip.selectedTrip &&
                `${new Date(
                  trip.selectedTrip.travelDates.startAt,
                ).toLocaleDateString()} - ${new Date(
                  trip.selectedTrip.travelDates.endAt,
                ).toLocaleDateString()}`}
            </div>
            <div>
              {users &&
                Object.keys(users).length &&
                trip.selectedTrip.attendees.map((key, idx) => {
                  return (
                    <div key={`${key.id}-${idx}`}>
                      <div>{users[key.id].name}</div>
                      <div>{`venmo: ${users[key.id].venmo}`}</div>
                      <div>{`quickpay: ${users[key.id].quickpay}`}</div>
                    </div>
                  );
                })}
            </div>
          </div>
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
          <Button color="primary" onClick={handleLeaveTrip} variant="contained">
            Leave
          </Button>
          <Button
            color="primary"
            onClick={toggleCreateExpenseModal}
            variant="contained"
          >
            New Expense
          </Button>
        </LeftPanel>
        <MainPanel>
          {trip.selectedTrip &&
            trip.selectedTrip.destinations.map((destination, idx) => {
              return (
                <div
                  key={`${destination}-${idx}`}
                  style={{
                    backgroundImage: `url(${destination.photo})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain, cover',
                    height: '100px',
                  }}
                >
                  {' '}
                </div>
              );
            })}
        </MainPanel>
        <RightPanel>
          {showTripMap ? (
            <TripMap destinations={trip.selectedTrip.destinations} />
          ) : null}
          {expenseList && (
            <TripExpense
              expenseList={expenseList}
              totalExpense={trip.selectedTrip.costs}
            />
          )}
        </RightPanel>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

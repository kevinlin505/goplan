import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Divider, withStyles } from '@material-ui/core';
import openWeatherApi from '@utils/openWeatherApi';
import { expenseActions } from '@providers/expense/expense';
import { userActions } from '@providers/user/user';
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

const mapStateToProps = (state, props) => {
  return {
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
  classes,
  history,
  trip,
  tripId,
  users,
  userInTrip,
  match,
}) => {
  const [isExpenseModal, setExpenseModal] = useState(false);
  const [expenseList, setExpenseList] = useState(null);
  const [weatherObject, setWeatherObject] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const google = googleMapsApi();
  const showTripCard =
    trip.selectedTrip && trip.selectedTrip.id === match.params.tripId;
  const showTripMap = showTripCard && google;
  const tripStartDate =
    trip.selectedTrip &&
    new Date(trip.selectedTrip.travelDates.startAt).toLocaleDateString();
  const tripEndDate =
    trip.selectedTrip &&
    new Date(trip.selectedTrip.travelDates.endAt).toLocaleDateString();

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
        trip.selectedTrip.name,
        getTravelDates(trip.selectedTrip),
      );
      setInviteEmail('');
    }
  }

  function getWeatherInfo(destinations) {
    const weather = { ...weatherObject };
    destinations.forEach(destination => {
      openWeatherApi(destination.geo).then(resp => {
        weather[destination.placeId] = {
          condition: resp.weather[0].main,
          icon: `http://openweathermap.org/img/wn/${resp.weather[0].icon}@2x.png`,
          temperature: resp.main.temp,
        };

        setWeatherObject(weather);
      });
    });
  }

  function renderWeatherObject(placeId) {
    const destinationWeather = weatherObject[placeId];

    return destinationWeather ? (
      <DestinationWeather>
        <div>Current weather condition</div>
        <WeatherInfo>
          <WeatherIcon>
            <WeatherIconImage
              alt={destinationWeather.condition}
              src={destinationWeather.icon}
            ></WeatherIconImage>
          </WeatherIcon>
          <WeatherTemperature>
            {destinationWeather.temperature.toFixed(1)} &#176;F
          </WeatherTemperature>
        </WeatherInfo>
        <div>{destinationWeather.condition}</div>
      </DestinationWeather>
    ) : null;
  }

  function renderDestinations() {
    return trip.selectedTrip.destinations.map((destination, idx) => {
      return (
        <DestinationContainer key={`trip-destination-${idx}`}>
          <div>
            <DestinationHeader>
              {`${tripStartDate} - ${destination.location}`}
            </DestinationHeader>
            <Divider component="div" />
            <DestinationInfo>
              <DestinationPhoto
                destinationPhoto={destination.photo.imageSourceUrl}
              ></DestinationPhoto>
              {renderWeatherObject(destination.placeId)}
            </DestinationInfo>
          </div>
        </DestinationContainer>
      );
    });
  }

  useEffect(() => {
    setValidEmail(validateEmail(inviteEmail));
  }, [inviteEmail]);

  useEffect(() => {
    actions.trip.getTrip(tripId).then(data => {
      actions.user.getAllMembers(data.selectedTrip.members);
      actions.trip.getTripExpenses(data.selectedTrip.expenses);
      getWeatherInfo(data.selectedTrip.destinations);

      setExpenseList(data.selectedTrip.expenses.map(ele => ele.id));
    });

    if (!userInTrip) {
      actions.trip.joinTrip(tripId);
    }
  }, []);

  // Need to clean up this part, we should not get into this component if selectedTrip is null.
  return (
    <Container>
      <Contents>
        <TopPanel>
          <TopLeftPanel>
            <CardContainer>
              <TripName>{trip.selectedTrip && trip.selectedTrip.name}</TripName>
              <TripDates>{`${tripStartDate} - ${tripEndDate}`}</TripDates>
              <TripMemberList>
                Members
                {users && Object.keys(users).length && (
                  <TripMembers members={trip.selectedTrip.members} />
                )}
              </TripMemberList>

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
          </TopLeftPanel>
          <TopMiddlePanel>
            <CardContainer>
              {trip.selectedTrip && renderDestinations()}
            </CardContainer>
          </TopMiddlePanel>
          <TopRightPanel>
            {expenseList && (
              <CardContainer>
                <TripExpenseSummary
                  expenseList={expenseList}
                  totalExpense={trip.selectedTrip.costs}
                />
              </CardContainer>
            )}
            {showTripMap && (
              <TripMap destinations={trip.selectedTrip.destinations} />
            )}
          </TopRightPanel>
        </TopPanel>
        <BottomPanel>
          {expenseList && (
            <div>
              <TripExpenseDetailsHeader>
                Detail expense by receipts
              </TripExpenseDetailsHeader>
              <TripExpenseDetails
                expenseList={expenseList}
                totalExpense={trip.selectedTrip.costs}
              />
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
  selectedTrip: PropTypes.object,
  trip: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  users: PropTypes.object,
  userInTrip: PropTypes.bool.isRequired,
};

TripDetail.defaultProps = {
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
  width: 28%;
  padding: 15px;
`;

const TopMiddlePanel = styled.div`
  width: 50%;
  padding: 15px;
`;

const TopRightPanel = styled.div`
  width: 22%;
  padding: 15px;
`;

const TripName = styled.div`
  font-size: 30px;
  margin: 8px 16px;
`;

const TripDates = styled.div`
  font-size: 18px;
  margin: 8px 16px;
`;

const TripMemberList = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  padding: 0;
  margin: 0 8px 0 16px;
`;

const Wrapper = styled.div`
  padding: 5px 0;
  margin: 5px 16px;
`;

const DestinationContainer = styled.div`
  position: relative;
  padding: 8px 16px;
`;

const DestinationHeader = styled.div`
  padding: 5px 0;
  font-size: 18px;
  font-weight: 500;
`;

const DestinationInfo = styled.div`
  display: flex;
  padding: 0;
`;

const DestinationPhoto = styled.div`
  padding: 10px;
  margin: 10px;
  background-image: url(${({ destinationPhoto }) => destinationPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover, contain;
  width: 50%;
  height: 100px;
  opacity: 0.8;
`;

const DestinationWeather = styled.div`
  padding: 10px;
  font-size: 16px;
`;

const TripExpenseDetailsHeader = styled.div`
  font-size: 18px;
`;

const WeatherInfo = styled.div`
  margin: 5px 0;
  display: flex;
  align-items: center;
`;

const WeatherIcon = styled.div`
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin: 0 10px 0 5px;
`;

const WeatherIconImage = styled.img`
  transform: scale(1.4);
  width: 30px;
`;

const WeatherTemperature = styled.div`
  font-size: 20px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(withRouter(TripDetail)));

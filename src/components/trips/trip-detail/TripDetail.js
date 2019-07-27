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
import { getParamTripId, getTripStatus } from '@selectors/tripSelector';
import TripCard from '@components/user-page/trip-card/TripCard';
import TripMap from '@components/trips/trip-detail/trip-map/TripMap';
import googleMapsApi from '@utils/googleMapsApi';
import TripExpense from '@components/trips/trip-detail/trip-expense/TripExpense';
import CreateExpense from './CreateExpense/CreateExpense';

const mapStateToProps = (state, props) => {
  return {
    trip: state.trip,
    tripId: getParamTripId(state, props),
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

const TripDetail = ({ actions, trip, tripId, userInTrip, match }) => {
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
    actions.trip.getTrip(tripId);

    if (!userInTrip) {
      actions.trip.joinTrip(tripId);
    }
  }, []);

  useEffect(() => {
    if (trip.selectedTrip) {
      actions.expense.getTripExpenses(trip.selectedTrip.expenses);
      setExpenseList(trip.selectedTrip.expenses.map(ele => ele.id));
    }
  }, [trip.selectedTrip]);

  // Need to clean up this part, we should not get into this component if selectedTrip is null.
  return (
    <Container>
      <Contents>
        <LeftPanel>
          {showTripCard ? <TripCard tripDetail={trip.selectedTrip} /> : null}
          <Button
            color="primary"
            onClick={toggleCreateExpenseModal}
            variant="contained"
          >
            New Expense
          </Button>
        </LeftPanel>
        <MainPanel>
          {showTripMap ? (
            <TripMap google={google} tripDetail={trip.selectedTrip} />
          ) : null}
        </MainPanel>
        <RightPanel>
          {expenseList && (
            <TripExpense
              expenseList={expenseList}
              totalExpense={trip.selectedTrip.costs}
            />
          )}
        </RightPanel>
      </Contents>
      {isExpenseModal && (
        <CreateExpense toggleCreateExpenseModal={toggleCreateExpenseModal} />
      )}
    </Container>
  );
};

TripDetail.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object,
  trip: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
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

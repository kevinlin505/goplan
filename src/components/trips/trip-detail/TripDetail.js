import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
import TripMap from '@components/trips/trip-detail/TripMap/TripMap';
import CreateExpense from './CreateExpense/CreateExpense';

const mapStateToProps = (state, props) => {
  return {
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

const TripDetail = ({ actions, trip, tripId, userInTrip }) => {
  const [isExpenseModal, setExpenseModal] = useState(false);

  const toggleCreateExpenseModal = () => {
    setExpenseModal(!isExpenseModal);
  };

  useEffect(() => {
    actions.trip.getTrip(tripId);

    if (!userInTrip) {
      actions.trip.joinTrip(tripId);
    }
  }, []);

  // Need to clean up this part, we should not get into this component if selectedTrip is null.
  return (
    <Container>
      <Contents>
        <LeftPanel>
          <Link to="/home">Back to Home</Link>
          {trip.selectedTrip && <TripCard tripDetail={trip.selectedTrip} />}
        </LeftPanel>
        <MainPanel>
          {trip.selectedTrip && <TripMap tripDetail={trip.selectedTrip} />}
        </MainPanel>
        <RightPanel>
          <Button
            color="primary"
            onClick={toggleCreateExpenseModal}
            variant="contained"
          >
            New Expense
          </Button>
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

const TripList = styled.div`
  display: flex;
  flex-direction: column;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

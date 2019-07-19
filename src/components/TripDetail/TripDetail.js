import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import NavigationBar from '@components/Navigation/NavigationBar';
import { expenseActions } from '@providers/expense/expense';
import { userActions } from '@providers/user/user';
import { tripActions } from '@providers/trip/trip';
import getTripStatus from '@selectors/tripSelector';
import CreateExpense from './CreateExpense/CreateExpense';

const mapStateToProps = (state, props) => {
  return {
    tripId: props.match.params.tripId,
    userInTrip: getTripStatus(state, state),
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

const TripDetail = ({ actions, tripId, userInTrip }) => {
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
    <div>
      <NavigationBar />
      <h2>Trip Details</h2>
      <Link to="/home">Back to Home</Link>

      <Button
        color="primary"
        onClick={toggleCreateExpenseModal}
        variant="contained"
      >
        New Expense
      </Button>

      {isExpenseModal && (
        <CreateExpense toggleCreateExpenseModal={toggleCreateExpenseModal} />
      )}
    </div>
  );
};

TripDetail.propTypes = {
  actions: PropTypes.object.isRequired,
  selectedTrip: PropTypes.object,
  tripId: PropTypes.string.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

TripDetail.defaultProps = {
  selectedTrip: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

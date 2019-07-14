import React, { useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { userActions } from '@providers/user/user';
import { tripActions } from '@providers/trip/trip';
import getTripStatus from '@selectors/tripSelector';

const mapStateToProps = (state, props) => {
  return {
    tripId: props.match.params.tripId,
    userInTrip: getTripStatus(state, state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
      user: bindActionCreators(userActions, dispatch),
    },
  };
};

const TripDetail = ({ actions, tripId, userInTrip }) => {
  useEffect(() => {
    if (!userInTrip) {
      actions.user.updateProfile({ joinTripId: tripId });
      actions.trip.updateTrip({ joinTripId: tripId });
    }
  }, []);

  return (
    <div>
      <h2>Trip Details</h2>
      <Link to="/home">Back to Home</Link>
    </div>
  );
};

TripDetail.propTypes = {
  actions: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

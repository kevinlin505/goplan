import React, { useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { userActions } from '@providers/user/user';
import { tripActions } from '@providers/trip/trip';
import getTripStatus from '@selectors/trip_selector';

const mapStateToProps = (state, ownProps) => {
  const joinTripId = ownProps.match.params;
  return {
    auth: state.auth,
    userInTrip: getTripStatus(state, joinTripId),
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

const TripDetail = ({ actions, match, userInTrip }) => {
  const currentTripId = match.params.tripId;
  // const [userInTrip, setUserInTrip] = useState(false);

  // useEffect(() => {
  //   auth.profile.trips.forEach(el => {
  //     if (el.id === currentTripId) setUserInTrip(true);
  //   });
  // }, []);

  useEffect(() => {
    if (userInTrip === false) {
      actions.user.updateProfile({ joinTripId: currentTripId });
      actions.trip.updateTrip({ joinTripId: currentTripId });
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
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userInTrip: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

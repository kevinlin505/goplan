import React, { useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { userActions } from '@providers/user/user';
import { tripActions } from '@providers/trip/trip';

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      user: bindActionCreators(userActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const TripDetail = ({ auth, actions, match }) => {
  useEffect(() => {
    const currentTripId = match.params.tripId;
    let inTrip = false;
    auth.profile.trips.forEach(el => {
      if (el.id === currentTripId) inTrip = true;
    });
    if (!inTrip) {
      actions.user.updateProfile({ joinTripId: currentTripId });
      actions.trip.updateTrip({ tripId: currentTripId });
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
  auth: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

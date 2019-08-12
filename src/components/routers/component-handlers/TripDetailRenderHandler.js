import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { tripActions } from '@providers/trip/trip';
import { getParamTripId, getTripStatus } from '@selectors/tripSelector';
import Loading from '@components/loading/Loading';
import TripDetail from '@components/trip-detail/TripDetail';

const mapStateToProps = (state, props) => {
  // console.log(props.math.params);
  return {
    tripId: getParamTripId(state, props),
    userInTrip: getTripStatus(state, props),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

export const TripDetailRenderHandler = ({ actions, tripId, userInTrip }) => {
  const [showTrip, setShowTrip] = useState(false);

  useEffect(() => {
    if (tripId) {
      actions.trip.getTrip(tripId).then(tripDetail => {
        actions.trip.getTripExpenses(tripDetail.expenses);
        actions.trip.subscribeToTripChange(tripId);

        setShowTrip(true);
      });

      if (!userInTrip) {
        actions.trip.joinTrip(tripId);
      }
    }

    return () => {
      actions.trip.unsubscribeToTripChange();
    };
  }, []);

  if (!showTrip) {
    return <Loading />;
  }

  return <TripDetail />;
};

TripDetailRenderHandler.propTypes = {
  actions: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  tripId: PropTypes.string.isRequired,
  selectedTrip: PropTypes.object,
  userInTrip: PropTypes.bool.isRequired,
};

TripDetailRenderHandler.defaultProps = {
  selectedTrip: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TripDetailRenderHandler);

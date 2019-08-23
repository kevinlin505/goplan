import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { activityActions } from '@providers/activity/activity';
import { tripActions } from '@providers/trip/trip';
import { getParamTripId, getTripStatus } from '@selectors/tripSelector';
import Loading from '@components/loading/Loading';
import TripDetail from '@components/trip-detail/TripDetail';

const mapStateToProps = (state, props) => {
  return {
    tripId: getParamTripId(state, props),
    userInTrip: getTripStatus(state, props),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      activity: bindActionCreators(activityActions, dispatch),
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

export const TripDetailRenderHandler = ({ actions, tripId, userInTrip }) => {
  const [showTrip, setShowTrip] = useState(false);

  useEffect(() => {
    if (tripId) {
      if (!userInTrip) {
        actions.trip.joinTrip(tripId).then(() => {
          actions.trip.getTrip(tripId).then(tripDetail => {
            actions.trip.getTripExpenses(tripDetail.expenses);
            actions.trip.subscribeToTripChange(tripId);
            actions.activity.subscribeToActivityChange(tripId);

            setShowTrip(true);
          });
        });
      } else {
        actions.trip.getTrip(tripId).then(tripDetail => {
          actions.trip.getTripExpenses(tripDetail.expenses);
          actions.trip.subscribeToTripChange(tripId);
          actions.activity.subscribeToActivityChange(tripId);

          setShowTrip(true);
        });
      }
    }

    return () => {
      actions.trip.unsubscribeToTripChange();
      actions.activity.unsubscribeToActivityChange();
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

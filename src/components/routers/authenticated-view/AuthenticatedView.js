import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { tripActions } from '@providers/trip/trip';
import NavigationBar from '@components/navigation/NavigationBar';
import Loading from '@components/loading/Loading';

const mapStateToProps = state => {
  return {
    profile: state.auth.profile,
    selectedTrip: state.trip.selectedTrip,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const AuthenticatedView = ({
  actions,
  component: Component,
  match,
  profile,
  selectedTrip,
  ...props
}) => {
  useEffect(() => {
    if (
      match.params &&
      match.params.tripId &&
      (!selectedTrip || !selectedTrip[match.params.tripId])
    ) {
      actions.trip.getTrip(match.params.tripId);
    }
  }, [match.params.tripId]);

  return profile &&
    ((match.params.tripId && selectedTrip) || !match.params.tripId) ? (
    <React.Fragment>
      <NavigationBar />
      <Component match={match} {...props} />
    </React.Fragment>
  ) : (
    <Loading />
  );
};

AuthenticatedView.propTypes = {
  actions: PropTypes.object.isRequired,
  component: PropTypes.any.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.object,
  selectedTrip: PropTypes.object,
};

AuthenticatedView.defaultProps = {
  profile: null,
  selectedTrip: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthenticatedView);

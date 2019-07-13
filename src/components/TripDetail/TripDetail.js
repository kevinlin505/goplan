import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const TripDetail = props => {
  return (
    <div>
      <h2>Trip Details</h2>
      <Link to="/home">Back to Home</Link>
    </div>
  );
};

TripDetail.propTypes = {
  props: PropTypes.object.isRequired,
};

export default withRouter(TripDetail);

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

const mapStateToProps = (state, props) => {
  return {
    selectedTrip: state.trip.selectedTrip,
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

const TripDetail = ({ actions, selectedTrip, tripId, userInTrip }) => {
  const [file, setFile] = useState(null);
  const [previewImageSrc, setPreviewImageSrc] = useState(null);

  const handleFileUpload = event => {
    const fileReader = new FileReader();
    const inputFile = event.target.files[0];

    fileReader.readAsDataURL(inputFile);
    fileReader.onload = loadEvent => {
      setPreviewImageSrc(loadEvent.target.result);
    };

    setFile(inputFile);
  };

  const handlePushToAWS = () => {
    if (file) {
      actions.expense.uploadReceipts(file);
    }
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

      {selectedTrip && (
        <div>
          <FileInput
            accept="image/*"
            id="contained-button-file"
            multiple
            onChange={handleFileUpload}
            type="file"
          />
          <label htmlFor="contained-button-file">
            <Button component="span" variant="contained">
              Upload
            </Button>
          </label>

          <Button onClick={handlePushToAWS} variant="contained">
            Push to S3
          </Button>
          {file && (
            <div>
              {file.name}
              <img src={previewImageSrc} />
            </div>
          )}
        </div>
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

const FileInput = styled.input`
  display: none;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripDetail));

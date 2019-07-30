import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  CircularProgress,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { tripActions } from '@providers/trip/trip';
import Attendees from '@components/trips/attendees/Attendees';
import Destinations from '@components/trips/destinations/Destinations';
import NameAndNotes from '@components/trips/name-and-notes/NameAndNotes';
import Container from '@styles/modal/Container';
import FormHeader, { FormHeaderWrapper } from '@styles/modal/FormHeader';
import Overlay from '@styles/modal/Overlay';
import CloseButton from '@styles/modal/CloseButton';
import { ButtonWrapper } from '@styles/forms/Forms';

const mapStateToProps = state => {
  return {
    auth: state.auth,
    trip: state.trip,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

function getSteps() {
  return ['Trip name', 'Destinations', 'Attendees'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <NameAndNotes />;
    case 1:
      return <Destinations />;
    case 2:
      return <Attendees />;
    default:
      return <NameAndNotes />;
  }
}

const NewTripModal = ({ actions, trip }) => {
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isNextButtonsDisabled, setNextButtonsDisabled] = useState({
    0: true,
    1: true,
    2: true,
  });

  useEffect(() => {
    setNextButtonsDisabled({
      0: !trip.form.name.trim(),
      1: !trip.form.destinations.length,
      2: !trip.form.attendees.length,
    });
  }, [
    trip.form.name,
    trip.form.destinations.length,
    trip.form.attendees.length,
  ]);

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleModalClose() {
    actions.trip.toggleNewTripModal();
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    setLoading(true);
    actions.trip.createTrip();
  }

  // Create all the steps
  function constructStepForm() {
    return steps.map((label, index) => (
      <Step key={`${label}-${index}`}>
        <StepLabel>{label}</StepLabel>
        <StepContent>
          {getStepContent(index)}
          <ButtonWrapper>
            <BackButton
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </BackButton>
            <Button
              color="primary"
              disabled={isNextButtonsDisabled[index] || loading}
              onClick={
                activeStep === steps.length - 1 ? handleFormSubmit : handleNext
              }
              type="button"
              variant="contained"
            >
              {loading ? (
                <CircularProgress size={22} />
              ) : (
                `${activeStep === steps.length - 1 ? 'Finish' : 'Next'}`
              )}
            </Button>
          </ButtonWrapper>
        </StepContent>
      </Step>
    ));
  }

  return (
    <Overlay>
      <Container>
        <CloseButton onClick={handleModalClose}>
          <CloseIcon />
        </CloseButton>
        <FormHeaderWrapper>
          <FormHeader>New trip</FormHeader>
        </FormHeaderWrapper>
        <Stepper activeStep={activeStep} orientation="vertical">
          {constructStepForm()}
        </Stepper>
      </Container>
    </Overlay>
  );
};

NewTripModal.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
};

const BackButton = styled(Button)`
  margin-right: 10px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewTripModal);

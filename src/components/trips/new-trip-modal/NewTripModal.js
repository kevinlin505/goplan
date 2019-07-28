import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'firebase/firestore';
import firebase from '@data/_db';
import {
  Button,
  Chip,
  TextField,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseIcon from '@material-ui/icons/Close';
import FaceIcon from '@material-ui/icons/Face';
import ButtonStyles from '@constants/ButtonStyles';
import { tripActions } from '@providers/trip/trip';
import googleMapsApi from '@utils/googleMapsApi';
import validateEmail from '@utils/validateEmail';
import Container from '@styles/modal/Container';
import FormHeader, { FormHeaderWrapper } from '@styles/modal/FormHeader';
import Overlay from '@styles/modal/Overlay';
import CloseButton from '@styles/modal/CloseButton';
import { FieldWrapper, GroupFieldWrapper, Input } from '@styles/forms/Forms';
import NameAndNotes from '@components/trips/name-and-notes/NameAndNotes';
import Destinations from '@components/trips/destinations/Destinations';

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

function getStepContent(step, actions, trip) {
  switch (step) {
    case 0:
      return <NameAndNotes actions={actions} trip={trip} />;
    case 1:
      return <Destinations actions={actions} trip={trip} />;
    case 2:
      return <div>testing3</div>;
    default:
      return <div>testing1</div>;
  }
}

const NewTripModal = ({ actions, trip }) => {
  const steps = getSteps();
  const [activeStep, setActiveStep] = useState(0);
  const [isNextButtonsEnabled, setNextButtonsEnabled] = useState({
    0: true,
    1: true,
    2: true,
  });

  useEffect(() => {
    setNextButtonsEnabled({
      ...isNextButtonsEnabled,
      0: !trip.form.name.trim(),
    });
  }, [trip.form.name]);

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  // function handleReset() {
  //   setActiveStep(0);
  // }

  // Create all the steps
  function constructStepForm() {
    return steps.map((label, index) => (
      <Step key={`${label}-${index}`}>
        <StepLabel>{label}</StepLabel>
        <StepContent>
          {getStepContent(index, actions, trip)}
          <ButtonWrapper>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              color="primary"
              disabled={isNextButtonsEnabled[index]}
              onClick={handleNext}
              variant="contained"
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </ButtonWrapper>
        </StepContent>
      </Step>
    ));
  }

  return (
    <Overlay>
      <Container>
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

const FullWidthField = styled(TextField)`
  width: 100%;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`;

const InviteChip = styled(Chip)`
  && {
    margin: 10px 5px;
  }
`;

const FormError = styled.div`
  color: red;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewTripModal);

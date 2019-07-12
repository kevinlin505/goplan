import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseIcon from '@material-ui/icons/Close';
import { tripActions } from '@providers/trip/trip';
import validateEmail from '@utils/validateEmail';
import Overlay from '@styles/Overlay';
import dockPng from '@assets/images/dock.jpg';

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

export const CreateTrip = ({ actions, toggleCreateTripModal }) => {
  const [invite, setInvite] = useState('');
  const [inviteList, setInviteList] = useState(null);
  const [formError, setFormError] = useState('');
  const [form, setValues] = useState({
    end_date: '',
    trip_name: '',
    notes: '',
    start_date: '',
    attendees: [],
  });

  const updateField = event => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const updateInviteField = event => {
    if (event.type === 'change') {
      setInvite(event.target.value);
    } else if (event.keyCode === 13 || event.key === 'Enter') {
      if (validateEmail(event.target.value)) {
        setValues({
          ...form,
          attendees: [...form.attendees, event.target.value],
        });

        setInvite('');
      }
    }
  };

  const handleCreateTrip = () => {
    actions.trip
      .createTrip(form)
      .then(() => {
        toggleCreateTripModal();
      })
      .catch(error => {
        // TODO: Display error on the form.
        setFormError(error.message);
      });
  };

  useEffect(() => {
    const handleDelete = index => {
      setValues({
        ...form,
        attendees: [
          ...form.attendees.slice(0, index),
          ...form.attendees.slice(index + 1),
        ],
      });
    };

    const chips = form.attendees.map((attendee, index) => {
      return (
        <InviteChip
          key={attendee}
          color="primary"
          deleteIcon={<CancelIcon />}
          icon={<FaceIcon />}
          label={attendee}
          onDelete={() => handleDelete(index)}
        />
      );
    });

    setInviteList(chips);
  }, [form.attendees.length]);

  return (
    <Overlay>
      <Container>
        <FormHeader>
          <CloseButton onClick={toggleCreateTripModal}>
            <CloseIcon />
          </CloseButton>
          <Header>Create trip</Header>
        </FormHeader>
        <CreateTripForm>
          <FieldWrapper>
            <FullWidthField
              isRequired
              label="Trip Name"
              name="trip_name"
              onChange={updateField}
              placeholder="Enter a name for this trip"
              type="text"
              value={form.trip_name}
            />
            <FullWidthField
              label="Notes"
              margin="normal"
              multiline
              name="notes"
              onChange={updateField}
              placeholder="Enter any notes to share to attendees"
              rowsMax={5}
              type="text"
              value={form.notes}
            />
          </FieldWrapper>
          <FieldWrapper>
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              isRequired
              label="Start Date"
              name="start_date"
              onChange={updateField}
              type="date"
              value={form.start_date}
            />
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              isRequired
              label="End Date"
              name="end_date"
              onChange={updateField}
              type="date"
              value={form.end_date}
            />
          </FieldWrapper>
          <FieldWrapper>
            <FullWidthField
              label="Attendees"
              name="attendee"
              onChange={updateInviteField}
              onKeyPress={updateInviteField}
              placeholder="Enter email address to invite"
              type="text"
              value={invite}
            />
            <InviteListWrapper>{inviteList}</InviteListWrapper>
          </FieldWrapper>
          <FormError>{formError}</FormError>
          <ButtonWrapper>
            <Button
              color="primary"
              onClick={handleCreateTrip}
              variant="contained"
            >
              Create
            </Button>
          </ButtonWrapper>
        </CreateTripForm>
      </Container>
    </Overlay>
  );
};

CreateTrip.propTypes = {
  actions: PropTypes.object.isRequired,
  toggleCreateTripModal: PropTypes.func.isRequired,
};

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  background: #ffffff;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100px;
  background: url(${dockPng});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const CloseButton = styled(IconButton)`
  && {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    color: #ffffff;
    z-index: 1px;
  }
`;

const Header = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 30px;
  color: #ffffff;
  text-transform: uppercase;
`;

const CreateTripForm = styled.form`
  padding: 25px;
`;

const FieldWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  flex-flow: row wrap;
  padding: 10px 20px;
`;

const FullWidthField = styled(TextField)`
  width: 100%;
`;

const HalfWidthField = styled(TextField)`
  width: 45%;
`;

const InviteListWrapper = styled.div`
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
  padding: 10px 20px;
`;

export default connect(
  null,
  mapDispatchToProps,
)(CreateTrip);

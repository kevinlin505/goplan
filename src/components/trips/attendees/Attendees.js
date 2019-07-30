import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Chip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import FaceIcon from '@material-ui/icons/Face';
import { tripActions } from '@providers/trip/trip';
import validateEmail from '@utils/validateEmail';
import { FieldWrapper, Input } from '@styles/forms/Forms';

const mapStateToProps = state => {
  return {
    form: state.trip.form,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const Attendees = ({ actions, form }) => {
  const [invite, setInvite] = useState('');

  function updateField(event) {
    if (event.type === 'change') {
      setInvite(event.target.value);
    } else if (
      event.type === 'blur' ||
      event.keyCode === 13 ||
      event.key === 'Enter'
    ) {
      event.preventDefault();

      if (validateEmail(event.target.value)) {
        actions.trip.updateForm('attendees', [
          ...form.attendees,
          event.target.value,
        ]);

        setInvite('');
      }
    }
  }

  function handleRemoveAttendee(position) {
    actions.trip.removeAttendee(position);
  }

  function constructAttendeeList() {
    return form.attendees.map((attendee, index) => {
      return (
        <InviteChip
          key={attendee}
          color="primary"
          deleteIcon={<CancelIcon />}
          icon={<FaceIcon />}
          label={attendee}
          onDelete={() => handleRemoveAttendee(index)}
        />
      );
    });
  }

  return (
    <React.Fragment>
      <FieldWrapper>
        <Input
          label="Attendees"
          name="attendee"
          onBlur={updateField}
          onChange={updateField}
          onKeyPress={updateField}
          placeholder="Enter an email"
          type="text"
          value={invite}
        />
      </FieldWrapper>
      <FieldWrapper>{constructAttendeeList()}</FieldWrapper>
    </React.Fragment>
  );
};

Attendees.propTypes = {
  actions: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

const InviteChip = styled(Chip)`
  margin: 5px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Attendees);

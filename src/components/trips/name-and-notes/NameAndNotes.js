import React from 'react';
import PropTypes from 'prop-types';
import { FieldWrapper, Input } from '@styles/forms/Forms';
import FormHeader from '@styles/modal/FormHeader';

export const NameAndNotes = ({ actions, trip }) => {
  function updateField(event) {
    actions.trip.updateForm(event.target.name, event.target.value);
  }

  return (
    <React.Fragment>
      <FormHeader>Enter a name and any notes for the trip</FormHeader>
      <FieldWrapper>
        <Input
          label="Trip name"
          name="name"
          onChange={updateField}
          required
          type="text"
          value={trip.form.name}
        />
      </FieldWrapper>
      <FieldWrapper>
        <Input
          label="Notes"
          name="notes"
          onChange={updateField}
          type="text"
          value={trip.form.notes}
        />
      </FieldWrapper>
    </React.Fragment>
  );
};

NameAndNotes.propTypes = {
  actions: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
};

export default NameAndNotes;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { tripActions } from '@providers/trip/trip';
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

const NameAndNotes = ({ actions, form }) => {
  function updateField(event) {
    actions.trip.updateForm(event.target.name, event.target.value);
  }

  return (
    <React.Fragment>
      <FieldWrapper>
        <Input
          label="Trip name"
          name="name"
          onChange={updateField}
          required
          type="text"
          value={form.name}
        />
      </FieldWrapper>
      <FieldWrapper>
        <Input
          label="Notes"
          name="notes"
          onChange={updateField}
          type="text"
          value={form.notes}
        />
      </FieldWrapper>
    </React.Fragment>
  );
};

NameAndNotes.propTypes = {
  actions: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameAndNotes);

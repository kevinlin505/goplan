import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Chip } from '@material-ui/core';
import { FieldWrapper, GroupFieldWrapper, Input } from '@styles/forms/Forms';
import FormHeader from '@styles/modal/FormHeader';

export const Destinations = ({ actions, trip }) => {
  const [destination, setDestination] = useState({
    location: '',
    geo: '',
    address: '',
    photo: '',
    id: '',
    types: [],
    startAt: '',
    endAt: '',
  });

  function updateField(event) {
    setDestination({
      ...destination,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <React.Fragment>
      <FormHeader>Enter a name and any notes for the trip</FormHeader>
      <div>
        {/* <ChipWrapper>{destinationList}</ChipWrapper>
        <div ref={mapRef}></div> */}
      </div>
      <FieldWrapper>
        <Input
          label="Destinations"
          name="location"
          onChange={updateField}
          required
          type="text"
          value={destination.location}
        />
      </FieldWrapper>
      <GroupFieldWrapper>
        <Input
          InputLabelProps={{
            shrink: true,
          }}
          label="Start Date"
          name="startAt"
          onChange={updateField}
          required
          type="date"
          value={destination.startAt}
        />
        <Input
          InputLabelProps={{
            shrink: true,
          }}
          label="End Date"
          name="endAt"
          onChange={updateField}
          required
          type="date"
          value={destination.endAt}
        />
      </GroupFieldWrapper>
      <Button color="secondary">Add Destination</Button>
    </React.Fragment>
  );
};

Destinations.propTypes = {
  actions: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
};

export default Destinations;

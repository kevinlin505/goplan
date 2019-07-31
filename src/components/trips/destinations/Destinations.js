import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Chip, CircularProgress } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { tripActions } from '@providers/trip/trip';
import 'firebase/firestore';
import firebase from '@data/_db';
import googleMapsApi from '@utils/googleMapsApi';
import TripMap from '@components/trips/trip-detail/trip-map/TripMap';
import {
  ButtonWrapper,
  FieldWrapper,
  GroupFieldWrapper,
  Input,
} from '@styles/forms/Forms';

const mapStateToProps = state => {
  return {
    destinations: state.trip.form.destinations,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      trip: bindActionCreators(tripActions, dispatch),
    },
  };
};

const DEFAULT_DESTINATION_FORM = {
  location: '',
  geo: '',
  address: '',
  photo: '',
  types: [],
  startAt: '',
  endAt: '',
};

const AUTO_COMPLETE_API_FIELDS = [
  'address_components',
  'formatted_address',
  'geometry',
  'name',
  'place_id',
];

const Destinations = ({ actions, destinations }) => {
  const google = googleMapsApi();
  const mapRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [destination, setDestination] = useState(DEFAULT_DESTINATION_FORM);
  const [invalidDestination, setInvalidDestination] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const autoCompleteApi = new google.maps.places.Autocomplete(
      destinationInputRef.current,
    );

    autoCompleteApi.setFields(AUTO_COMPLETE_API_FIELDS);

    const autoCompletePlaceChangedListener = autoCompleteApi.addListener(
      'place_changed',
      () => {
        const place = autoCompleteApi.getPlace();

        if (place.geometry) {
          const country = place.address_components.filter(component =>
            component.types.includes('country'),
          );

          setDestination({
            ...destination,
            address: place.formatted_address,
            country: (country[0] && country[0].long_name) || '',
            geo: new firebase.firestore.GeoPoint(
              place.geometry.location.lat(),
              place.geometry.location.lng(),
            ),
            placeId: place.place_id,
            location: place.name,
            types:
              place.address_components[0] && place.address_components[0].types,
          });
        }
      },
    );

    return () => {
      google.maps.event.removeListener(autoCompletePlaceChangedListener);
    };
  }, []);

  function updateField(event) {
    setDestination({
      ...destination,
      [event.target.name]: event.target.value,
    });
  }

  function handleAddDestination() {
    setLoading(true);

    const googlePlaceService = new google.maps.places.PlacesService(
      mapRef.current,
    );

    if (destination.address && !destination.geo) {
      googlePlaceService.textSearch({ query: destination.address }, data => {
        const destinationSearchResult = data[0];
        if (destinationSearchResult) {
          actions.trip
            .getUnsplashImage({
              query: [destinationSearchResult.name, 'China'],
            })
            .then(url => {
              const updatedDestination = {
                ...destination,
                address: destinationSearchResult.formatted_address,
                location: destinationSearchResult.name,
                geo: new firebase.firestore.GeoPoint(
                  destinationSearchResult.geometry.location.lat(),
                  destinationSearchResult.geometry.location.lng(),
                ),
                photo: url,
                placeId: destinationSearchResult.place_id,
                types: destinationSearchResult.types,
                endAt: new Date(destination.endAt).getTime(),
                startAt: new Date(destination.startAt).getTime(),
              };

              actions.trip.updateForm('destinations', [
                ...destinations,
                updatedDestination,
              ]);

              // reset form
              setDestination(DEFAULT_DESTINATION_FORM);
              setInvalidDestination(false);
              setLoading(false);
            });
        } else {
          setInvalidDestination(true);
          setLoading(false);
        }
      });
    } else if (destination.geo) {
      actions.trip
        .getUnsplashImage({
          query: [destination.location, 'China'],
        })
        .then(url => {
          actions.trip.updateForm('destinations', [
            ...destinations,
            {
              ...destination,
              photo: url,
              endAt: new Date(destination.endAt).getTime(),
              startAt: new Date(destination.startAt).getTime(),
            },
          ]);

          // reset form
          setDestination(DEFAULT_DESTINATION_FORM);
          setInvalidDestination(false);
          setLoading(false);
        });
    } else {
      setInvalidDestination(true);
      setLoading(false);
    }
  }

  function handleRemoveDestination(index) {
    actions.trip.removeDestination(index);
  }

  function constructDestinationList() {
    return destinations.map((selectedDestination, index) => {
      return (
        <DestinationChip
          key={selectedDestination.location}
          color="primary"
          deleteIcon={<CancelIcon />}
          label={selectedDestination.location}
          onDelete={() => handleRemoveDestination(index)}
        />
      );
    });
  }

  return (
    <React.Fragment>
      <FieldWrapper>
        <Input
          autoComplete="off"
          error={invalidDestination}
          inputRef={destinationInputRef}
          label="Destinations"
          name="address"
          onBlur={updateField}
          onChange={updateField}
          onKeyPress={updateField}
          type="search"
          value={destination.address}
        />
      </FieldWrapper>
      <GroupFieldWrapper>
        <DateInput
          InputLabelProps={{
            shrink: true,
          }}
          label="Start Date"
          name="startAt"
          onChange={updateField}
          type="date"
          value={destination.startAt}
        />
        <DateInput
          InputLabelProps={{
            shrink: true,
          }}
          label="End Date"
          name="endAt"
          onChange={updateField}
          type="date"
          value={destination.endAt}
        />
      </GroupFieldWrapper>
      <FieldWrapper>{constructDestinationList()}</FieldWrapper>
      <ButtonWrapper>
        <Button
          color="secondary"
          disabled={
            !(destination.address && destination.startAt && destination.endAt)
          }
          onClick={handleAddDestination}
        >
          {loading ? <CircularProgress size={22} /> : 'Add Destination'}
        </Button>
      </ButtonWrapper>
      <TripMap destinations={destinations} />
      <div ref={mapRef} />
    </React.Fragment>
  );
};

Destinations.propTypes = {
  actions: PropTypes.object.isRequired,
  destinations: PropTypes.array.isRequired,
};

const DateInput = styled(Input)`
  width: 49%;
`;

const DestinationChip = styled(Chip)`
  margin: 5px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Destinations);

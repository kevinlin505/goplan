import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'firebase/firestore';
import firebase from '@data/_db';
import { Button, Chip, IconButton, TextField } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseIcon from '@material-ui/icons/Close';
import FaceIcon from '@material-ui/icons/Face';
import { tripActions } from '@providers/trip/trip';
import validateEmail from '@utils/validateEmail';
import dockPng from '@assets/images/dock.jpg';
import Overlay from '@styles/Overlay';
import googleApiFunc from '@utils/googleMapsApi';

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

const NewTripModal = ({ actions, auth }) => {
  const [destinationInputValue, setDestinationInputValue] = useState('');
  const [invite, setInvite] = useState('');
  const [inviteList, setInviteList] = useState(null);
  const [destinationList, setDestinationList] = useState(null);
  const [placeServices, setPlaceServices] = useState(null);
  const [formError, setFormError] = useState('');
  const [form, setValues] = useState({
    end_date: '',
    trip_name: '',
    notes: '',
    start_date: '',
    attendees: [],
    destinations: [],
  });
  const destinationInputRef = useRef(null);
  const mapRef = useRef(null);

  const updateField = event => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const searchDestination = query => {
    if (query) {
      placeServices.textSearch({ query }, data => {
        const destinationDetail = {};

        if (data[0]) {
          destinationDetail.photos = data[0].photos.map(photo => {
            return {
              url: photo.getUrl(),
              height: photo.height,
              width: photo.width,
            };
          });
          destinationDetail.name = data[0].name;
          destinationDetail.geo = new firebase.firestore.GeoPoint(
            data[0].geometry.location.lat(),
            data[0].geometry.location.lng(),
          );
          destinationDetail.place_id = data[0].place_id;
          destinationDetail.types = data[0].types;
          destinationDetail.formatted_address = data[0].formatted_address;
        }

        setValues({
          ...form,
          destinations: [...form.destinations, destinationDetail],
        });

        setDestinationInputValue('');
      });
    }
  };

  const updateDestinationField = event => {
    if (event.type === 'change') {
      setDestinationInputValue(event.target.value);
    } else if (
      event.type === 'blur' ||
      event.keyCode === 13 ||
      event.key === 'Enter'
    ) {
      searchDestination(event.target.value);
    }
  };

  const updateInviteField = event => {
    if (event.type === 'change') {
      setInvite(event.target.value);
    } else if (
      event.type === 'blur' ||
      event.keyCode === 13 ||
      event.key === 'Enter'
    ) {
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
        actions.trip.toggleNewTripModal();
      })
      .catch(error => {
        // TODO: Display error on the form.
        setFormError(error.message);
      });
  };

  useEffect(() => {
    const google = googleApiFunc();
    const googlePlaceService = new google.maps.places.PlacesService(
      mapRef.current,
    );
    const googleAutoComplete = new google.maps.places.Autocomplete(
      destinationInputRef.current,
    );
    setPlaceServices(googlePlaceService);
  }, []);

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

  useEffect(() => {
    const handleDelete = index => {
      setValues({
        ...form,
        destinations: [
          ...form.destinations.slice(0, index),
          ...form.destinations.slice(index + 1),
        ],
      });
    };

    const chips = form.destinations.map((location, index) => {
      return (
        <InviteChip
          key={location.name}
          color="primary"
          deleteIcon={<CancelIcon />}
          label={location.name}
          onDelete={() => handleDelete(index)}
        />
      );
    });

    setDestinationList(chips);
  }, [form.destinations.length]);

  return (
    <Overlay>
      <Container>
        <FormHeader>
          <CloseButton onClick={actions.trip.toggleNewTripModal}>
            <CloseIcon />
          </CloseButton>
          <Header>Create trip</Header>
        </FormHeader>
        <CreateTripForm>
          <FieldWrapper>
            <FullWidthField
              label="Trip Name"
              name="trip_name"
              onChange={updateField}
              placeholder="Enter a name for this trip"
              required
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
            <FullWidthField
              inputRef={destinationInputRef}
              label="Destination"
              onBlur={updateDestinationField}
              onChange={updateDestinationField}
              onKeyPress={updateDestinationField}
              type="search"
              value={destinationInputValue}
            />
            <ChipWrapper>{destinationList}</ChipWrapper>
            <div ref={mapRef}></div>
          </FieldWrapper>
          <FieldWrapper>
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              label="Start Date"
              name="start_date"
              onChange={updateField}
              required
              type="date"
              value={form.start_date}
            />
            <HalfWidthField
              InputLabelProps={{
                shrink: true,
              }}
              label="End Date"
              name="end_date"
              onChange={updateField}
              required
              type="date"
              value={form.end_date}
            />
          </FieldWrapper>
          <FieldWrapper>
            <FullWidthField
              label="Attendees"
              name="attendee"
              onBlur={updateInviteField}
              onChange={updateInviteField}
              onKeyPress={updateInviteField}
              placeholder="Enter email address to invite"
              type="text"
              value={invite}
            />
            <ChipWrapper>{inviteList}</ChipWrapper>
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

NewTripModal.propTypes = {
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired,
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
  padding: 10px 20px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewTripModal);

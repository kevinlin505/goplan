import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TripCard = ({ tripDetails }) => {
  const startDate = new Date(tripDetails.start_date.toDate());
  const endDate = new Date(tripDetails.end_date.toDate());
  const { destinations } = tripDetails;
  const attendeeNames = tripDetails.attendees.map(attendee => {
    return <li key={`attendee-${attendee.email}`}>{attendee.name}</li>;
  });

  return (
    <Container
      backgroundImageUrl={
        destinations[0].photos ? destinations[0].photos[0].url : null
      }
    >
      <LocationName>{destinations[0].formatted_address}</LocationName>
      <TripCardDetail to={`/trip/${tripDetails.id}`}>
        <Name>{tripDetails.trip_name}</Name>
        <TravelDate>
          {`Travel Date: ${startDate.toLocaleDateString()}`} -{' '}
          {`${endDate.toLocaleDateString()}`}
        </TravelDate>
        <AttendeeList>
          Attendee(s):
          {attendeeNames}
        </AttendeeList>
        <div>Spending: {tripDetails.spending}</div>
      </TripCardDetail>
    </Container>
  );
};

TripCard.propTypes = {
  tripDetails: PropTypes.object.isRequired,
};

const AttendeeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Container = styled.div`
  background-image: url(${({ backgroundImageUrl }) => backgroundImageUrl});
  background-size: cover;
  color: black;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  margin: 0px auto;
  padding: 0px;
  width: 50%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TripCardDetail = styled(Link)`
  background: white;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 5px 5px;
  padding: 20px;
  height: 40%;
  text-decoration: none;
`;

const Name = styled.div`
  font-size: 20px;
  padding-bottom: 20px;
  text-decoration: underline;
`;

const LocationName = styled.h2`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  padding: 10px;
`;

const TravelDate = styled.div``;

export default TripCard;

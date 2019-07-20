import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import unsplashHelper from '@utils/unsplashHelper';

const TripCard = ({ tripDetails }) => {
  const startDate = new Date(tripDetails.start_date.toDate());
  const endDate = new Date(tripDetails.end_date.toDate());
  const destination = tripDetails.destinations[0]
    ? tripDetails.destinations[0]
    : null;
  const attendeeNames = tripDetails.attendees.map(attendee => {
    return <li key={`attendee-${attendee.email}`}>{attendee.name}</li>;
  });
  const imageUrl = unsplashHelper.imageUrl(
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjgyNjA0fQ',
  );

  return (
    <Container
      backgroundImageUrl={imageUrl}
      // {destination ? destination.photos[0].url : null}
    >
      <TripCardGradient>
        <TextContainer>
          <LocationName>
            {destination ? destination.formatted_address : null}
          </LocationName>
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
        </TextContainer>
      </TripCardGradient>
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
  border-radius: ${props => props.theme.sizes.cornerRadius};
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
  margin: 10px auto;
  padding: 0px;
  width: 50%;
  max-width: 600px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TextContainer = styled.div`
  padding: ${props => props.theme.sizes.padding};
`;

const TripCardGradient = styled.div`
  background: rgb(255, 255, 255);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 1) 100%
  );
  min-height: 300px;
  border-radius: ${props => props.theme.sizes.cornerRadius};
`;

const TripCardDetail = styled(Link)`
  color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  height: 40%;
  text-decoration: none;
  color: white;
`;

const Name = styled.div`
  font-size: 20px;
  padding-bottom: 20px;
  text-decoration: underline;
  color: white;
`;

const LocationName = styled.h1`
  padding: 10px;
  color: white;
`;

const TravelDate = styled.div``;

export default TripCard;

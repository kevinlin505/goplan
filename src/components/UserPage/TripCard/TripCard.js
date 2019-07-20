import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TripCard = ({ tripDetail }) => {
  const [attendeeList, setSttendeeList] = useState(null);
  const startDate = new Date(tripDetail.start_date.toDate());
  const endDate = new Date(tripDetail.end_date.toDate());
  const destination =
    tripDetail.destinations[0] > 0 ? tripDetail.destinations[0] : null;
  const totalCost = Object.keys(tripDetail.costs).reduce((sum, category) => {
    return sum + tripDetail.costs[category];
  }, 0);

  useEffect(() => {
    setSttendeeList(
      tripDetail.attendees.map(attendee => {
        return <li key={`attendee-${attendee.email}`}>{attendee.name}</li>;
      }),
    );
  }, [tripDetail.attendees.length]);

  return (
    <Container
      backgroundImageUrl={
        destination && destination.photos[0] ? destination.photos[0].url : null
      }
    >
      <TripCardGradient>
        <TextContainer>
          <LocationName>
            {destination ? destination.formatted_address : null}
          </LocationName>
          <TripCardDetail to={`/trip/${tripDetail.id}`}>
            <Name>{tripDetail.trip_name}</Name>
            <TravelDate>
              {`Travel Date: ${startDate.toLocaleDateString()}`} -{' '}
              {`${endDate.toLocaleDateString()}`}
            </TravelDate>
            <AttendeeList>
              Attendee(s):
              {attendeeList}
            </AttendeeList>
            <div>Spending: {totalCost}</div>
          </TripCardDetail>
        </TextContainer>
      </TripCardGradient>
    </Container>
  );
};

TripCard.propTypes = {
  tripDetail: PropTypes.object.isRequired,
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

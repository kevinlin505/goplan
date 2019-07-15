import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TripCard = ({ tripDetails }) => {
  const startDate = new Date(tripDetails.start_date);
  const endDate = new Date(tripDetails.end_date);

  return (
    <Container>
      <Link to={`/trip/${tripDetails.id}`}>
        <Name>{tripDetails.name}</Name>
        <TravelDate>
          {`Travel Date: ${startDate.toLocaleDateString()}`} -{' '}
          {`${endDate.toLocaleDateString()}`}
        </TravelDate>
        <div>Name: {tripDetails.destinations[0].name}</div>
        <div>Country: {tripDetails.destinations[0].country}</div>
        <div>Spending: {tripDetails.spending}</div>
      </Link>
    </Container>
  );
};

TripCard.propTypes = {
  tripDetails: PropTypes.object.isRequired,
};

const Container = styled.div`
  background: #ededed;
  color: black;
  border: 1px solid gray;
  margin: 10px auto;
  padding: 10px;
`;

const Name = styled.div`
  font-size: 16px;
`;

const TravelDate = styled.div``;

export default TripCard;

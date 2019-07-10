import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TripCard = ({ tripDetails }) => {
  const startDate = new Date(tripDetails.start_date);
  const endDate = new Date(tripDetails.end_date);

  return (
    <Container>
      <Name>{tripDetails.name}</Name>
      <TravelDate>
        {`Travel Date: ${startDate.getMonth()}/${startDate.getDate()}/${startDate.getFullYear()}`}{' '}
        -{' '}
        {`${endDate.getMonth()}/${endDate.getDate()}/${endDate.getFullYear()}`}
      </TravelDate>
      <div>Name: {tripDetails.destinations[0].name}</div>
      <div>Country: {tripDetails.destinations[0].country}</div>
      <div>Spending: {tripDetails.spending}</div>
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

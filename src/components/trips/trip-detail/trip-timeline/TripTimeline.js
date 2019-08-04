import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TripTimeline = destinations => {
  function renderTimeline() {
    return destinations.map((destination, idx) => {
      return (
        <DestinationContainer key={`${destination}-${idx}`}>
          <DestinationContent>
            <DestinationHeader>
              {`${new Date(destination.startAt).toLocaleDateString()} - ${
                destination.location
              }`}
            </DestinationHeader>
            <DestinationInfo>
              <DestinationPhoto
                key={`${destination}-${idx}`}
                destinationPhoto={destination.photo}
              >
                {' '}
              </DestinationPhoto>
              <DestinationWeather>
                <div>Weather Info</div>
              </DestinationWeather>
            </DestinationInfo>
          </DestinationContent>
        </DestinationContainer>
      );
    });
  }

  return (
    <TimelineContainer>
      <TimelineBar></TimelineBar>
      {renderTimeline()}
    </TimelineContainer>
  );
};

TripTimeline.PropTypes = {
  destinations: PropTypes.object.isRequired,
};

const TimelineContainer = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 25px;
`;

const TimelineBar = styled.div`
  width: 2px;
  position: absolute;
  background-color: #ccd1d9;
  top: 0;
  bottom: 0;
  left: 0;
`;

const DestinationContainer = styled.div`
  padding: 0 20px;
  margin: 20px 0;
  position: relative;
`;

const DestinationContent = styled.div`
  &:after {
    content: '';
    position: absolute;
    background-color: #4fc1e9;
    border: 2px solid white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    left: -7px;
    transition: width 0.25s, height 0.25s, left 0.25s, top 0.25s;
    top: 2.5px;
  }

  &:hover:after {
    width: 24px;
    height: 24px;
    left: -11px;
    top: -1.5px;
  }
`;

const DestinationHeader = styled.div`
  padding-bottom: 10px;
  font-size: 18px;
`;

const DestinationInfo = styled.div`
  display: flex;
  padding: 0;
`;

const DestinationPhoto = styled.div`
  padding: 10px;
  margin: 0 10px;
  background-image: url(${({ destinationPhoto }) => destinationPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover, contain;
  width: 50%;
  height: 100px;
  opacity: 0.8;
`;

const DestinationWeather = styled.div`
  display: flex;
  flex-direction: column;
`;

export default TripTimeline;

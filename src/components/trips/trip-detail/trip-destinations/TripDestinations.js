import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Divider } from '@material-ui/core';

const TripDestinations = ({ actions, destinations }) => {
  const [weatherObject, setWeatherObject] = useState({});

  useEffect(() => {
    const weather = { ...weatherObject };
    destinations.forEach(destination => {
      actions.trip
        .getWeather(destination.geo.latitude, destination.geo.longitude)
        .then(resp => {
          weather[destination.placeId] = {
            condition: resp.weather[0].main,
            icon: `http://openweathermap.org/img/wn/${resp.weather[0].icon}@2x.png`,
            temperature: resp.main.temp,
          };

          setWeatherObject(weather);
        });
    });
  }, []);

  function renderWeatherObject(placeId) {
    const destinationWeather = weatherObject[placeId];

    return destinationWeather ? (
      <DestinationWeather>
        <div>Current weather condition</div>
        <WeatherInfo>
          <WeatherIcon>
            <WeatherIconImage
              alt={destinationWeather.condition}
              src={destinationWeather.icon}
            ></WeatherIconImage>
          </WeatherIcon>
          <WeatherTemperature>
            {destinationWeather.temperature.toFixed(1)} &#176;F
          </WeatherTemperature>
        </WeatherInfo>
        <div>{destinationWeather.condition}</div>
      </DestinationWeather>
    ) : null;
  }

  return destinations.map((destination, idx) => {
    return (
      <DestinationContainer key={`trip-destination-${idx}`}>
        <div>
          <DestinationHeader>
            {`${new Date(destination.startAt).toLocaleDateString()} - ${
              destination.location
            }`}
          </DestinationHeader>
          <Divider component="div" />
          <DestinationInfo>
            <DestinationPhoto
              destinationPhoto={destination.photo.imageSourceUrl}
            ></DestinationPhoto>
            {renderWeatherObject(destination.placeId)}
          </DestinationInfo>
        </div>
      </DestinationContainer>
    );
  });
};

TripDestinations.propTypes = {
  actions: PropTypes.object.isRequired,
  destinations: PropTypes.array.isRequired,
};

const DestinationContainer = styled.div`
  position: relative;
  padding: 8px 16px;
`;

const DestinationHeader = styled.div`
  padding: 5px 0;
  font-size: 18px;
  font-weight: 500;
`;

const DestinationInfo = styled.div`
  display: flex;
  padding: 0;
`;

const DestinationPhoto = styled.div`
  padding: 10px;
  margin: 10px;
  background-image: url(${({ destinationPhoto }) => destinationPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover, contain;
  width: 50%;
  height: 100px;
  opacity: 0.8;
`;

const DestinationWeather = styled.div`
  padding: 10px;
  font-size: 16px;
`;

const WeatherInfo = styled.div`
  margin: 5px 0;
  display: flex;
  align-items: center;
`;

const WeatherIcon = styled.div`
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin: 0 10px 0 5px;
`;

const WeatherIconImage = styled.img`
  transform: scale(1.4);
  width: 30px;
`;

const WeatherTemperature = styled.div`
  font-size: 20px;
`;

export default TripDestinations;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
        <WeatherIcon>
          <WeatherIconImage
            alt={destinationWeather.condition}
            src={destinationWeather.icon}
          ></WeatherIconImage>
        </WeatherIcon>
        <WeatherInfo>
          <WeatherTemperature>
            {destinationWeather.temperature.toFixed(1)} &#176;F
          </WeatherTemperature>
          <WeatherCondition>{destinationWeather.condition}</WeatherCondition>
        </WeatherInfo>
      </DestinationWeather>
    ) : null;
  }

  function constructDestinations() {
    return destinations.map((destination, idx) => {
      const sizedImageUrl = `${destination.photo.imageSourceUrl}&w600`;

      return (
        <DestinationContainer key={`trip-destination-${idx}`}>
          <DestinationHeader>
            {`${new Date(destination.startAt).toLocaleDateString()} - ${
              destination.location
            }`}
          </DestinationHeader>
          <DestinationPhoto destinationPhoto={sizedImageUrl} />
          <DestinationInfo>
            {renderWeatherObject(destination.placeId)}
          </DestinationInfo>
        </DestinationContainer>
      );
    });
  }

  return <Container>{constructDestinations()}</Container>;
};

TripDestinations.propTypes = {
  actions: PropTypes.object.isRequired,
  destinations: PropTypes.array.isRequired,
};

const Container = styled.div``;

const DestinationContainer = styled.div`
  position: relative;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

const DestinationHeader = styled.div`
  font-size: 18px;
`;

const DestinationInfo = styled.div`
  display: flex;
  padding: 0;
`;

const DestinationPhoto = styled.div`
  width: 100%;
  height: 150px;
  background-image: url(${({ destinationPhoto }) => destinationPhoto});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const DestinationWeather = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  font-size: 16px;
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const WeatherIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 5px;
  overflow: hidden;
`;

const WeatherIconImage = styled.img`
  width: 55px;
`;

const WeatherTemperature = styled.div`
  font-size: 18px;
`;

const WeatherCondition = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
`;

export default TripDestinations;

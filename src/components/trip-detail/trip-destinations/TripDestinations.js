import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PhotoAttribution from '@components/photo-attribution/PhotoAttribution';

const TripDestinations = ({ actions, destinations, weatherCache }) => {
  useEffect(() => {
    destinations.forEach(destination => {
      actions.trip.getWeather(
        destination.geo.latitude,
        destination.geo.longitude,
        destination.placeId,
      );
    });
  }, []);

  function renderWeatherObject(placeId) {
    const destinationWeather = weatherCache[placeId];

    if (destinationWeather) {
      const condition = destinationWeather.data.weather[0].main;
      const icon = `http://openweathermap.org/img/wn/${destinationWeather.data.weather[0].icon}@2x.png`;
      const temperature = destinationWeather.data.main.temp;

      return (
        <DestinationWeather>
          <WeatherIcon>
            <WeatherIconImage alt={condition} src={icon}></WeatherIconImage>
          </WeatherIcon>
          <WeatherInfo>
            <WeatherTemperature>
              {temperature.toFixed(1)} &#176;F
            </WeatherTemperature>
            <WeatherCondition>{condition}</WeatherCondition>
          </WeatherInfo>
        </DestinationWeather>
      );
    }

    return null;
  }

  function constructDestinations() {
    return destinations.map((destination, idx) => {
      const { endAt, location, photo, placeId, startAt } = destination;
      const sizedImageUrl = `${photo.imageSourceUrl}&w600`;

      return (
        <DestinationContainer key={`trip-destination-${idx}`}>
          <DestinationHeader>
            <div>
              {`${new Date(startAt).toLocaleDateString()} - ${new Date(
                endAt,
              ).toLocaleDateString()}`}
            </div>
            <div>{location}</div>
          </DestinationHeader>
          <DestinationPhoto destinationPhoto={sizedImageUrl}>
            <PhotoAttribution
              photo={photo}
              splashPage={false}
            ></PhotoAttribution>
          </DestinationPhoto>
          <DestinationInfo>{renderWeatherObject(placeId)}</DestinationInfo>
        </DestinationContainer>
      );
    });
  }

  return constructDestinations();
};

TripDestinations.propTypes = {
  actions: PropTypes.object.isRequired,
  destinations: PropTypes.array.isRequired,
  weatherCache: PropTypes.object.isRequired,
};

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
  position: relative;
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

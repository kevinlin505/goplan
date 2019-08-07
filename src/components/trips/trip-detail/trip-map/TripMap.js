import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import googleMapsApi from '@utils/googleMapsApi';
import openWeatherApi from '@utils/openWeatherApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloud,
  faSun,
  faCloudShowersHeavy,
  faCloudSun,
  faSnowflake,
  faWater,
} from '@fortawesome/free-solid-svg-icons';

const TripMap = ({ destinations }) => {
  const google = googleMapsApi();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [markerList, setMarkerList] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [weatherObject, setWeatherObject] = useState({});
  const centerLat = destinations.length > 0 ? destinations[0].geo.latitude : 0;
  const centerLng = destinations.length > 0 ? destinations[0].geo.longitude : 0;
  const defaultProps = {
    center: {
      lat: centerLat,
      lng: centerLng,
    },
    zoom: 12,
  };

  const endDate =
    (activeLocation && new Date(activeLocation.endAt).toDateString()) || '';
  const startDate =
    (activeLocation && new Date(activeLocation.startAt).toDateString()) || '';

  function closeInfoWindow() {
    setShowingInfoWindow(false);
    setActiveMarker(null);
    setActiveLocation(null);
  }

  function onMarkerClick(marker, destination) {
    setShowingInfoWindow(true);
    setActiveMarker(marker);
    setActiveLocation(destination);
  }

  function pickWeatherIcon(condition) {
    switch (true) {
      case condition.includes('now'):
        return faSnowflake;
      case condition.includes('louds'):
        return faCloud;
      case condition.includes('storm'):
        return faCloudShowersHeavy;
      case condition.includes('ain'):
        return faCloudShowersHeavy;
      case condition.includes('ist') || condition.includes('aze'):
        return faWater;
      case condition.includes('sun') || condition.includes('lear'):
        return faSun;
      default:
        return faSun;
    }
  }

  function renderWeatherObject() {
    return Object.keys(weatherObject).map((address, idx) => {
      const destinationWeather = weatherObject[address];
      return (
        <div key={`destination-weather-${idx}`}>
          <div>{address}</div>
          <div>{destinationWeather.condition}</div>
          <div>{destinationWeather.temperature} F</div>
          <FontAwesomeIcon
            icon={pickWeatherIcon(destinationWeather.condition)}
          />
        </div>
      );
    });
  }

  useEffect(() => {
    const weather = { ...weatherObject };
    destinations.forEach(destination => {
      openWeatherApi(destination.geo).then(resp => {
        weather[destination.address] = {
          condition: resp.weather[0].main,
          temperature: resp.main.temp,
        };

        setWeatherObject(weather);
      });
    });
  }, []);

  useEffect(() => {
    const bounds = new google.maps.LatLngBounds();

    const list = destinations.map(destination => {
      const pos = {
        lat: destination.geo.latitude,
        lng: destination.geo.longitude,
      };

      bounds.extend(pos);

      return (
        <Marker
          key={`map-markers-${destination.location}`}
          name={destination.location}
          onClick={(e, marker) => onMarkerClick(marker, destination)}
          position={pos}
        />
      );
    });

    setMapBounds(bounds);
    setMarkerList(list);
  }, [destinations.length]);

  return (
    <Container>
      <Map
        bounds={destinations.length > 1 ? mapBounds : null}
        disableDefaultUI={true}
        fullscreenControl={true}
        google={google}
        initialCenter={defaultProps.center}
        zoom={defaultProps.zoom}
        zoomControl={true}
      >
        {markerList}
        <InfoWindow
          marker={activeMarker}
          onClose={closeInfoWindow}
          visible={showingInfoWindow}
        >
          <div>
            {activeLocation && (
              <React.Fragment>
                <MarkerName>{activeLocation.location}</MarkerName>
                <div>{`${startDate} - ${endDate}`}</div>
              </React.Fragment>
            )}
          </div>
        </InfoWindow>
      </Map>
      <WeatherContainer>{renderWeatherObject()}</WeatherContainer>
    </Container>
  );
};

TripMap.propTypes = {
  destinations: PropTypes.array.isRequired,
};

const Container = styled.div`
  width: 100%;
  height: 200px;
  max-width: 600px;
  position: relative;
`;

const MarkerName = styled.div`
  font-weight: 600;
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 300px;
`;

export default TripMap;

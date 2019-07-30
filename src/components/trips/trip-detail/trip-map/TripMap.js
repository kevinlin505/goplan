import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import googleMapsApi from '@utils/googleMapsApi';

const TripMap = ({ destinations }) => {
  const google = googleMapsApi();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [markerList, setMarkerList] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const centerLat = destinations.length > 0 ? destinations[0].geo.latitude : 0;
  const centerLng = destinations.length > 0 ? destinations[0].geo.longitude : 0;
  const defaultProps = {
    center: {
      lat: centerLat,
      lng: centerLng,
    },
    zoom: 8,
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
        bounds={mapBounds}
        disableDefaultUI={true}
        google={google}
        initialCenter={defaultProps.center}
        zoom={defaultProps.zoom}
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
    </Container>
  );
};

TripMap.propTypes = {
  destinations: PropTypes.array.isRequired,
};

const Container = styled.div`
  width: 100%;
  height: 300px;
  max-width: 600px;
  position: relative;
`;

const MarkerName = styled.div`
  font-weight: 600;
`;

export default TripMap;

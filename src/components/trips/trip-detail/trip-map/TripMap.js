import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map, InfoWindow, Marker } from 'google-maps-react';

const TripMap = ({ tripDetail, google }) => {
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [markerList, setMarkerList] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const centerLat =
    tripDetail.destinations.length > 0
      ? tripDetail.destinations[0].geo.latitude
      : 0;
  const centerLng =
    tripDetail.destinations.length > 0
      ? tripDetail.destinations[0].geo.longitude
      : 0;
  const defaultProps = {
    center: {
      lat: centerLat,
      lng: centerLng,
    },
    zoom: 10,
  };

  const closeInfoWindow = () => {
    setShowingInfoWindow(false);
    setActiveMarker(null);
  };

  const onMarkerClick = (event, marker) => {
    setShowingInfoWindow(true);
    setActiveMarker(marker);
  };

  useEffect(() => {
    var bounds = new google.maps.LatLngBounds();

    const list = tripDetail.destinations.map(destination => {
      const pos = {
        lat: destination.geo.latitude,
        lng: destination.geo.longitude,
      };

      bounds.extend(pos);

      return (
        <Marker
          key={`map-markers-${destination.name}`}
          name={destination.name}
          onClick={onMarkerClick}
          position={pos}
        />
      );
    });

    setMapBounds(bounds);
    setMarkerList(list);
  }, []);

  return (
    <Container>
      <Map
        bounds={tripDetail.destinations.length > 1 ? mapBounds : null}
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
            <h2>{activeMarker && activeMarker.name}</h2>
          </div>
        </InfoWindow>
      </Map>
    </Container>
  );
};

TripMap.propTypes = {
  tripDetail: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired,
};

const Container = styled.div`
  width: 100%;
  height: 550px;
  position: relative;
`;

export default TripMap;

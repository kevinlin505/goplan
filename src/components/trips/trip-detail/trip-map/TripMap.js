import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import Keys from '@constants/Keys';
import { Map, InfoWindow, Marker } from 'google-maps-react';
// import google from '@hooks/googleMapsApi';

const TripMap = ({ tripDetail, google }) => {
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [markerList, setMarkerList] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  const defaultProps = {
    center: {
      lat: tripDetail.destinations[0].geo.latitude,
      lng: tripDetail.destinations[0].geo.longitude,
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
  debugger;

  return (
    <div style={{ width: '100%', height: '550px', position: 'relative' }}>
      <Map
        bounds={tripDetail.destinations.length > 1 ? mapBounds : null}
        google={google}
        initialCenter={defaultProps.center}
        style={{ width: '100%', height: '100%' }}
        zoom={defaultProps.zoom}
      >
        {markerList}

        <InfoWindow
          marker={activeMarker}
          onClose={closeInfoWindow}
          visible={showingInfoWindow}
        >
          <div>
            <h1>{activeMarker && activeMarker.name}</h1>
          </div>
        </InfoWindow>
      </Map>
    </div>
  );
};

TripMap.propTypes = {
  tripDetail: PropTypes.object.isRequired,
  google: PropTypes.object.isRequired,
};

export default TripMap;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Keys from '@constants/Keys';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

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

  return (
    <div style={{ width: '100%', height: '550px', position: 'relative' }}>
      <Map
        bounds={mapBounds}
        google={google}
        initialCenter={defaultProps.center}
        style={{ width: '100%', height: '100%' }}
        zoom={mapBounds ? null : defaultProps.zoom}
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

export default GoogleApiWrapper({
  apiKey: Keys.FIREBASE.apiKey,
})(TripMap);

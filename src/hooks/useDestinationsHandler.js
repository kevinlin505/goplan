import { useState, useEffect } from 'react';
import google from '@utils/googleMapsApi';
// import Keys from '@constants/Keys';

export default function useDestinationsHandler({
  auth,
  destinationInputRef,
  mapRef,
}) {
  const [autoComplete, setAutoComplete] = useState(null);
  const [placeServices, setPlaceServices] = useState(null);

  // const [isGoogleApiReady, setGoogleApiReady] = useState(false);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${Keys.FIREBASE.apiKey}&libraries=places&sessiontoken=${auth.profile.id}`;
  //   script.onload = () => {
  //     setGoogleApiReady(true);
  //   };

  //   document.head.appendChild(script);
  // }, []);

  useEffect(() => {
    if (google && !placeServices) {
      setPlaceServices(new window.google.maps.places.PlacesService(mapRef));
      setAutoComplete(
        new window.google.maps.places.Autocomplete(destinationInputRef),
      );
    }
  }, [google]);

  return {
    autoComplete,
    placeServices,
  };
}

import { useEffect, useState } from 'react';
import Keys from '@constants/Keys';

const googleApiFunc = () => {
  const [isGoogleApiReady, setGoogleApiReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    // script.src = `https://maps.googleapis.com/maps/api/js?key=${Keys.FIREBASE.apiKey}&libraries=places&sessiontoken=${auth.profile.id}`;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${Keys.FIREBASE.apiKey}&libraries=places`;
    script.onload = () => {
      setGoogleApiReady(true);
    };

    document.head.appendChild(script);
  }, []);

  return isGoogleApiReady ? window.google : null;
};

export default window.google ? window.google : googleApiFunc();

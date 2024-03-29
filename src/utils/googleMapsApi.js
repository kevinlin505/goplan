import Keys from '@constants/Keys';

const googleMapsApi = () => {
  if (window.google) return window.google;

  const apiKey =
    process.env.NODE_ENV === 'production'
      ? Keys.FIREBASE.mapApiKey
      : Keys.FIREBASE_DEV.apiKey;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.onload = () => {
    return window.google;
  };
  document.head.appendChild(script);

  return window.google;
};

export default googleMapsApi;

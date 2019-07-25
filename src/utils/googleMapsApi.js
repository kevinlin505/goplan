import Keys from '@constants/Keys';

const googleApiFunc = () => {
  if (window.google) return window.google;
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${Keys.FIREBASE.apiKey}&libraries=places`;
  script.onload = () => {
    return window.google;
  };
  document.head.appendChild(script);
  return window.google;
};

export default googleApiFunc;

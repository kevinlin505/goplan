const functions = require('firebase-functions');
const axios = require('axios');
const keys = require('../constants/Keys');

const weatherHelper = {
  apiUrl: (latitude, longitude, apiKey) => {
    return `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
  },
};

const getWealther = async options => {
  const url = weatherHelper.apiUrl(options.latitude, options.longitude, keys.OPENWEATHER.apiKey);
  console.log(`url: ${url}`);

  return axios
    .get(url)
    .then(response => {
        const result = { main, weather } = response.data;
        return result; 
    })
    .catch(err => {
      console.error(`erorr: ${err}`);
      return null;
    });
}

module.exports = functions.https.onCall(options => {
  return getWealther(options);
});
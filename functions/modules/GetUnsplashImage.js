const functions = require('firebase-functions');
const axios = require('axios');
const keys = require('../constants/Keys');

const unsplashHelper = {
  apiUrl: (accessToken, query) => {
    return `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${accessToken}&orientation=landscape`;
  },
};

const getImage = async options => {
  if (options.query === undefined || options.query.length === 0) {
    return null;
  }
  const url = unsplashHelper.apiUrl(
    keys.UNSPLASH.accessToken,
    options.query[0],
  );
  console.log(`url: ${url}`);

  return axios
    .get(url)
    .then(response => {
      const results = response.data.results;
      if (results.length > 0) {
        const result = results[0];
        const imageSourceUrl = result.urls.full;
        const name = result.user.name;
        const handle = result.user.username;
        console.log(`data: ${imageSourceUrl}`);

        return { imageSourceUrl, name, handle };
      }

      // Try again
      options.query.shift();
      return getImage(options);
    })
    .catch(err => {
      console.error(`erorr: ${err}`);

      // Try again
      options.query.shift();
      return getImage(options);
    });
}

module.exports = functions.https.onCall(options => {
  if (options.query.length > 2) {
    return null;
  }
  return getImage(options);
});
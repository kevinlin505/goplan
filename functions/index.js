const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Invitation Email
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'GoPlan';

async function sendInvitationEmail(email, invitationLink) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };
  mailOptions.subject = `Invitation to join ${APP_NAME}!`;
  mailOptions.text = `Please join GoPlan. Link: ${invitationLink}`;
  await mailTransport.sendMail(mailOptions);
  return null;
}

exports.sendInvitationEmail = functions.https.onCall(data => {
  return sendInvitationEmail(data.email, data.invitationLink);
});

// Unsplash
const unsplashHelper = {
  apiUrl: (accessToken, query) => {
    return `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${accessToken}&orientation=landscape`;
  },
  imageUrl: (sourceUrl, sizeParam = '&w=600&h=300') => {
    return `${sourceUrl}${sizeParam}`;
  },
};

async function getImage(url) {
  return axios
    .get(url)
    .then(response => {
      const results = response.data.results;
      if (results.length > 0) {
        const imageSourceUrl = results[0].urls.full;
        const resizedUrl = unsplashHelper.imageUrl(imageSourceUrl);
        console.log(`data: ${resizedUrl}`);
        return resizedUrl;
      }
      return null;
    })
    .catch(err => {
      console.error(`erorr: ${err}`);
      return null;
    });
}

exports.getUnsplashImage = functions.https.onCall(query => {
  const url = unsplashHelper.apiUrl(
    '7110f5de36f381d4394475668a2e656f8100a914a8e73d5b4e6e2d469e15296d',
    query,
  );
  console.log(`url: ${url}`);
  return getImage(url);
});

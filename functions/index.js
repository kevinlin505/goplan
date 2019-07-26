const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const axios = require('axios');
const uuidv3 = require('uuid/v3');
const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
const keys = require('./constants/Keys');

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
};

async function getImage(url) {
  return axios
    .get(url)
    .then(response => {
      const results = response.data.results;
      if (results.length > 0) {
        const imageSourceUrl = results[0].urls.full;
        console.log(`data: ${imageSourceUrl}`);
        return imageSourceUrl;
      }
      return null;
    })
    .catch(err => {
      console.error(`erorr: ${err}`);
      return null;
    });
}

exports.getUnsplashImage = functions.https.onCall(options => {
  const url = unsplashHelper.apiUrl(keys.UNSPLASH.accessToken, options.query);
  console.log(`url: ${url}`);
  return getImage(url);
});

// AWS S3
const getBase64Helper = dataString => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
};

async function uploadToS3(options) {
  const buff = getBase64Helper(options.data).data;
  const params = {
    Bucket: `${keys.AWS.bucketName}/expense/${options.tripId}`,
    Key: uuidv3(options.name, keys.AWS.uuid),
    ContentType: options.type,
    Body: buff,
  };

  AWS.config.region = keys.AWS.region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: keys.AWS.IdentityPoolId,
  });

  const bucket = new S3();
  const promise = new Promise((resolve, reject) => {
    bucket.putObject(params, (err, data) => {
      if (err) {
        console.error(`erorr: ${err}`);
        reject(err);
      }
      console.log(data);
      resolve(data);
    });
  });
  return promise.then(res => {
    if (res) {
      const url = `https://${keys.AWS.bucketName}.s3.amazonaws.com/expense/${options.tripId}/${params.Key}`;
      console.log(url);
      return url;
    }
    return null;
  });
}

exports.uploadReceipt = functions.https.onCall(options => {
  return uploadToS3(options);
});

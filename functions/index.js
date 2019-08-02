const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const axios = require('axios');
const uuidv3 = require('uuid/v3');
const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
const handlebars = require('handlebars');
const fs = require('fs');
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

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

async function sendInvitationEmail(options) {
  const promise = new Promise((resolve, reject) => {
    readHTMLFile('./constants/invitation-email-template.html', (err, html) => {
      if (err) {
        reject(err);
      }
      const template = handlebars.compile(html);
      const replacements = {
        inviterName: options.inviterName,
        inviterEmail: options.inviterEmail,
        invitationLink: options.invitationLink,
      };
      const htmlToSend = template(replacements);
      resolve(htmlToSend);
    });
  });

  return promise.then(res => {
    const mailOptions = {
      from: `${APP_NAME} <noreply@firebase.com>`,
      to: options.inviteeEmail,
      subject: `Invitation to join ${APP_NAME}!`,
      html: res,
    };
    mailTransport.sendMail(mailOptions);
    return null;
  });
}

exports.sendInvitationEmail = functions.https.onCall(options => {
  return sendInvitationEmail(options);
});

// Unsplash
const unsplashHelper = {
  apiUrl: (accessToken, query) => {
    return `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${accessToken}&orientation=landscape`;
  },
};

async function getImage(options) {
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

exports.getUnsplashImage = functions.https.onCall(options => {
  if (options.query.length > 2) {
    return null;
  }
  return getImage(options);
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

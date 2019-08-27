const functions = require('firebase-functions');
const uuidv3 = require('uuid/v3');
const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
const keys = require('../constants/Keys');

const UploadHelper = {
  imageUrl: (bucketName, tripId, uniqueKey) => {
    return `https://${bucketName}.s3.amazonaws.com/expense/${tripId}/${uniqueKey}`;
  },
  getBase64: dataString => {
    const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];

    // new Buffer() is deprecated, Buffer.from is recommended as replacement
    // https://nodejs.org/api/buffer.html#buffer_new_buffer_array
    response.data = Buffer.from(matches[2], 'base64');

    return response;
  },
};

const uploadToS3 = async (options, context) => {
  const buff = UploadHelper.getBase64(options.data).data;
  const bucketName = functions.config().app.environment === 'dev' ? 
    keys.AWS.bucketNameDev : keys.AWS.bucketName
  console.log(`bucketName: ${bucketName}`);
  const params = {
    Bucket: `${bucketName}/expense/${options.tripId}`,
    Key: uuidv3(
      `${options.name}${options.tripId}${context.auth.uid}`,
      keys.AWS.uuid,
    ),
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
      const url = UploadHelper.imageUrl(
        keys.AWS.bucketName,
        options.tripId,
        params.Key,
      );
      console.log(url);
      return url;
    }
    return null;
  });
};

module.exports = functions.https.onCall((options, context) => {
  return uploadToS3(options, context);
});

const functions = require('firebase-functions');
const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
const keys = require('../constants/Keys');

const deleteFromS3 = options => {
  AWS.config.region = keys.AWS.region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: keys.AWS.IdentityPoolId,
  });
  const bucket = new S3();

  return Promise.all(options.urls.map(url => {
    return new Promise((resolve, reject) => {
        const splitUrl = url.split('.s3.amazonaws.com/');
        const path = splitUrl[1];
        const bucketName = splitUrl[0].split('https://')[1];
        const params = {
            Bucket: bucketName,
            Key: path,
        };
        bucket.deleteObject(params, (err, data) => {
        if (err) {
            console.error(`erorr: ${err}`);
            reject(err);
        }
        console.log(data);
        resolve(data);
        });
    });
  })).then(res => {
    return null;
  });
}

module.exports = functions.https.onCall(options => {
    return deleteFromS3(options);
});
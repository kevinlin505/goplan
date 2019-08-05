const functions = require('firebase-functions');
const uuidv3 = require('uuid/v3');
const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
const keys = require('../constants/Keys');

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
  
const uploadToS3 = async options => {
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
  
module.exports = functions.https.onCall(options => {
    return uploadToS3(options);
});
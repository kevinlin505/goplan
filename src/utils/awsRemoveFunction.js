import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import Keys from '@constants/Keys';

export default function awsRemoveFunction(receipts) {
  AWS.config.region = Keys.AWS.region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: Keys.AWS.IdentityPoolId,
  });
  const bucket = new S3();

  receipts.forEach(receipt => {
    const path = receipt.url.split('s3.amazonaws.com/')[1];
    const params = {
      Bucket: `${Keys.AWS.bucketName}`,
      Key: path,
    };

    bucket.deleteObject(params, (err, data) => {
      if (err) {
        console.log(`erorr: ${err}`);
      } else console.log(data);
    });
  });
}

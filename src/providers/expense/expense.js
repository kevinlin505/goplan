import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import Keys from '@constants/Keys';

export const types = {
  UPLOAD_RECEIPT: 'EXPENSE/UPLOAD_RECEIPT',
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPLOAD_RECEIPT: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

export const userActions = {
  uploadReceipts: file => dispatch => {
    AWS.config.region = Keys.AWS.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: Keys.AWS.IdentityPoolId,
    });

    const bucket = new S3();
    const params = {
      Bucket: Keys.AWS.bucketName,
      Key: file.name,
      ContentType: file.type,
      Body: file,
    };

    bucket.putObject(params, err => {
      if (err) {
        console.log(err);
      } else {
        return dispatch({
          type: types.UPLOAD_RECEIPT,
        });
      }
    });
  },
};

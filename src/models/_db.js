import firebase from 'firebase/app';
import 'firebase/auth';
import Keys from '@constants/Keys';

const initializeFireBase = async () => {
  // Initialize firebase connection
  firebase.initializeApp(Keys.FIREBASE);

  // State will be persisted even when the activity is destroyed.
  const response = await firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  return response;
};

export default initializeFireBase;

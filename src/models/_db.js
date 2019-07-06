import * as firebase from 'firebase';
import Keys from '@models/keys';

const initializeFireBase = async () => {
  // Initialize firebase connection
  firebase.initializeApp(Keys.FIREBASE);

  // State will be persisted even when the activity is destroyed.
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
};

export default {
  initializeFireBase,
};

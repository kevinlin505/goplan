import firebase from 'firebase/app';
import 'firebase/firestore';
import Keys from '@constants/Keys';

const initializeFireBase = () => {
  if (process.env.production) {
    firebase.initializeApp(Keys.FIREBASE);
  } else {
    firebase.initializeApp(Keys.FIREBASE_DEV);
  }

  // State will be persisted even when the activity is destroyed.
  firebase.firestore().enablePersistence({ synchronizeTabs: true });

  return firebase;
};

export default !firebase.apps.length ? initializeFireBase() : firebase;

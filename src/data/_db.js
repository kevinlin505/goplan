import firebase from 'firebase/app';
import 'firebase/auth';
import Keys from '@constants/Keys';

const initializeFireBase = () => {
  // Initialize firebase connection
  if (!firebase.apps.length) {
    firebase.initializeApp(Keys.FIREBASE);

    // State will be persisted even when the activity is destroyed.
    return firebase.firestore().enablePersistence({ synchronizeTabs: true });
  }

  return firebase.app();
};

export default initializeFireBase;

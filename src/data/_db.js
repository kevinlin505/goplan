import firebase from 'firebase/app';
import 'firebase/auth';
import Keys from '@constants/Keys';

const initializeFireBase = () => {
  // Initialize firebase connection
  firebase.initializeApp(Keys.FIREBASE);

  // State will be persisted even when the activity is destroyed.
  const db = firebase.firestore();
  db.enablePersistence({
    synchronizeTabs: true,
  });

  return db;
};

export default initializeFireBase;

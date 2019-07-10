import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

export default function user() {
  return {
    checkUserProfile: () => {
      const db = firebase.firestore();
      const { currentUser } = firebase.auth();

      return db
        .collection('users')
        .doc(currentUser.uid)
        .get();
    },

    createUserProfile: () => {
      const db = firebase.firestore();
      const { currentUser } = firebase.auth();
      debugger
      const profileDefault = {
        creation_time: currentUser.metadata.creationTime,
        email: currentUser.email,
        email_verified: currentUser.emailVerified,
        last_sign_in_time: currentUser.metadata.lastSignInTime,
        name: currentUser.displayName,
        phone_number: currentUser.phoneNumber,
        profile_url: currentUser.photoURL,
        quickpay: '',
        spendings: {
          document: 0,
          equiment: 0,
          food: 0,
          ticket: 0,
          transportation: 0,
        },
        trips: [],
        venmo: '',
      };

      return db
        .collection('users')
        .doc(currentUser.uid)
        .set(profileDefault);
    },

    updateUserProfile: (profile = {}) => {
      const db = firebase.firestore();
      const { currentUser } = firebase.auth();

      return db
        .collection('users')
        .doc(currentUser.uid)
        .update(profile);
    },
  };
}

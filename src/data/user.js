import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

export default function user() {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  let unsubscribe = null;

  return {
    checkUserProfile: () => {
      return db
        .collection('users')
        .doc(currentUser.uid)
        .get();
    },

    createUserProfile: () => {
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
      const newProfile = profile;
      if (newProfile.joinTripId) {
        const tripRef = db.collection('trips').doc(newProfile.joinTripId);
        newProfile.trips = firebase.firestore.FieldValue.arrayUnion(tripRef);
        delete newProfile.joinTripId;
      }
      return db
        .collection('users')
        .doc(currentUser.uid)
        .update(newProfile);
    },

    subscribeToProfileChange: callback => {
      if (!unsubscribe && callback) {
        unsubscribe = db
          .collection('users')
          .doc(currentUser.uid)
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            callback,
          );
      }
    },

    unsubscribeToProfileChange: () => {
      if (unsubscribe) {
        unsubscribe();
      }
    },
  };
}

import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import firebase from '@data/_db';

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
        id: currentUser.uid,
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

    // fetch all attendee from an array of userRef and return user objects
    getAllAttendees: attendeeObjects => {
      return Promise.all(
        attendeeObjects.map(attendeeObject => {
          return db
            .collection('users')
            .doc(attendeeObject.id)
            .get();
        }),
      );
    },

    updateUserProfile: (profile = {}) => {
      return db
        .collection('users')
        .doc(currentUser.uid)
        .update(profile);
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

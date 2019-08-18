import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import firebase from '@data/_db';
import ActivityType from '@constants/ActivityType';

let unsubscribe = null;

export default function activity() {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();
  let creator;

  if (currentUser) {
    creator = {
      name: currentUser.displayName,
      id: currentUser.uid,
      avatar: currentUser.photoURL,
      email: currentUser.email,
    };
  }

  return {
    createActivity: tripId => {
      const action = {
        creator,
        data: {},
        timestamp: new Date().getTime(),
        type: ActivityType.CREATE_TRIP,
      };

      return db
        .collection('activities')
        .doc(tripId)
        .set({
          actions: [action],
          tripId,
        });
    },

    updateActivity: (type, tripId, data = {}) => {
      const actionObject = {
        creator,
        data,
        timestamp: new Date().getTime(),
        type,
      };

      return db
        .collection('activities')
        .doc(tripId)
        .update({
          actions: firebase.firestore.FieldValue.arrayUnion(actionObject),
        });
    },

    getTripActivity: tripId => {
      return db
        .collection('activities')
        .doc(tripId)
        .get();
    },

    subscribeToActivityChange: (tripId, callback) => {
      if (!unsubscribe && callback) {
        unsubscribe = db
          .collection('activities')
          .doc(tripId)
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            callback,
          );
      }
    },

    unsubscribeToActivityChange: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
  };
}

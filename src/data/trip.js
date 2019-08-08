import 'firebase/auth';
import 'firebase/firestore';
import firebase from '@data/_db';

export default function trip() {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return {
    createTrip: tripDetails => {
      const batch = db.batch();

      // Create a trip with the provided details
      const userRef = db.collection('users').doc(currentUser.uid);
      const tripRef = db.collection('trips').doc();

      tripDetails.id = tripRef.id;

      batch.set(tripRef, tripDetails);
      batch.update(userRef, {
        trips: firebase.firestore.FieldValue.arrayUnion(tripRef),
      });

      return batch.commit().then(() => {
        return Promise.resolve(tripRef.id);
      });
    },

    getAllTrips: tripRefs => {
      return Promise.all(
        tripRefs.map(tripRef => {
          return tripRef.get();
        }),
      );
    },

    getTrip: tripRef => {
      if (typeof tripRef === 'string') {
        return db
          .collection('trips')
          .doc(tripRef)
          .get();
      }

      return tripRef.get();
    },

    getUnsplashImage: options => {
      return firebase.functions().httpsCallable('getUnsplashImage')(options);
    },

    getWeather: (latitude, longitude) => {
      return firebase.functions().httpsCallable('getWeather')({
        latitude,
        longitude,
      });
    },

    joinTrip: (tripId, { name, id, email }) => {
      const batch = db.batch();

      const userRef = db.collection('users').doc(currentUser.uid);
      const tripRef = db.collection('trips').doc(tripId);

      batch.update(tripRef, {
        [`members.${id}`]: { name, id, email },
        invites: firebase.firestore.FieldValue.arrayRemove(email),
      });
      batch.update(userRef, {
        trips: firebase.firestore.FieldValue.arrayUnion(tripRef),
      });

      return batch.commit();
    },

    leaveTrip: tripId => {
      const batch = db.batch();

      const tripRef = db.collection('trips').doc(tripId);
      const userRef = db.collection('users').doc(currentUser.uid);

      batch.update(tripRef, {
        [`members.${currentUser.uid}`]: firebase.firestore.FieldValue.delete(),
      });
      batch.update(userRef, {
        trips: firebase.firestore.FieldValue.arrayRemove(tripRef),
      });

      return batch.commit();
    },

    updateTrip: (tripId, tripDetail) => {
      return db
        .collection('trips')
        .doc(tripId)
        .update(tripDetail);
    },
  };
}

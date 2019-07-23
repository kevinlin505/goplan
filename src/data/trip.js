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

      tripDetails.attendees.push(userRef);
      tripDetails.id = tripRef.id;

      batch.set(tripRef, { ...tripDetails, organizer: userRef });
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

    getUnsplashImage: query => {
      return firebase.functions().httpsCallable('getUnsplashImage')(query);
    },

    joinTrip: (tripId, { name, id, email }) => {
      const batch = db.batch();
      const userRef = db.collection('users').doc(currentUser.uid);
      const tripRef = db.collection('trips').doc(tripId);
      const attendeeObject = { name, id, email };

      batch.update(tripRef, {
        attendees: firebase.firestore.FieldValue.arrayUnion(attendeeObject),
      });
      batch.update(userRef, {
        trips: firebase.firestore.FieldValue.arrayUnion(tripRef),
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

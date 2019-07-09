import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default function user() {
  return {
    createTrip: tripDetails => {
      const db = firebase.firestore();
      const batch = db.batch();
      const { currentUser } = firebase.auth();

      // Create a trip with the provided details
      const userRef = db.collection('users').doc(currentUser.uid);
      const tripRef = db.collection('trips').doc();

      // TODO update all attendees to reference this trip;
      batch.set(tripRef, { ...tripDetails, organizer: userRef });
      batch.update(userRef, {
        trips: firebase.firestore.FieldValue.arrayUnion(tripRef),
      });

      return batch.commit();
    },
  };
}

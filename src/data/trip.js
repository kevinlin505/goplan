import 'firebase/auth';
import 'firebase/firestore';
import firebase from '@data/_db';

let unsubscribe = null;

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

    deleteTrip: (tripId, tripExpenses, transaction) => {
      const currentUserRef = db.collection('users').doc(currentUser.uid);
      const tripRef = db.collection('trips').doc(tripId);
      const activityRef = db.collection('activities').doc(tripId);

      Object.keys(tripExpenses).forEach(expenseId => {
        const expenseRef = db.collection('expenses').doc(expenseId);

        tripExpenses[expenseId].payees.forEach(payee => {
          const userRef = db.collection('users').doc(payee.id);

          transaction.update(userRef, {
            expenses: firebase.firestore.FieldValue.arrayRemove(expenseRef),
          });
        });

        transaction.delete(expenseRef);
      });

      transaction.update(currentUserRef, {
        trips: firebase.firestore.FieldValue.arrayRemove(tripRef),
      });
      transaction.delete(tripRef);
      transaction.delete(activityRef);

      return 'delete trip';
    },

    leaveTrip: (tripId, tripExpenses) => {
      const tripRef = db.collection('trips').doc(tripId);
      const userRef = db.collection('users').doc(currentUser.uid);

      return db.runTransaction(transaction => {
        return transaction.get(tripRef).then(tripDoc => {
          if (!tripDoc.exists) {
            throw new Error('Document does not exist.');
          }

          const tripData = tripDoc.data();

          if (Object.keys(tripData.members).length === 1) {
            return trip().deleteTrip(tripId, tripExpenses, transaction);
          }

          if (currentUser.uid === tripData.organizer.id) {
            const memberArray = Object.values(tripData.members);
            let newOrganizer;

            if (memberArray[0].id !== tripData.organizer.id) {
              const { id, name, email } = memberArray[0];
              newOrganizer = { id, name, email };
            } else {
              const { id, name, email } = memberArray[1];
              newOrganizer = { id, name, email };
            }

            transaction.update(tripRef, {
              organizer: newOrganizer,
            });
          }

          transaction.update(tripRef, {
            [`members.${currentUser.uid}`]: firebase.firestore.FieldValue.delete(),
          });
          transaction.update(userRef, {
            trips: firebase.firestore.FieldValue.arrayRemove(tripRef),
          });

          return 'leave trip';
        });
      });
    },

    sendInviteEmail: (inviteeEmail, tripId, tripName, tripDates) => {
      const addMessage = firebase
        .functions()
        .httpsCallable('sendInvitationEmail');
      const startDate = new Date(tripDates.startAt).toDateString();
      const endDate = new Date(tripDates.endAt).toDateString();
      const formattedDates = `${startDate} - ${endDate}`;

      return db
        .collection('trips')
        .doc(tripId)
        .update({
          invites: firebase.firestore.FieldValue.arrayUnion(inviteeEmail),
        })
        .then(() =>
          addMessage({
            inviteeEmail,
            invitationLink: `https://goplan-3b4b1.web.app/#/trip/${tripId}`,
            inviterName: currentUser.displayName,
            inviterEmail: currentUser.email,
            tripName,
            tripDates: formattedDates,
          }),
        );
    },

    updateTrip: tripDetail => {
      return db
        .collection('trips')
        .doc(tripDetail.id)
        .update(tripDetail)
        .then(() => Promise.resolve());
    },

    subscribeToTripChange: (tripId, callback) => {
      if (!unsubscribe && tripId && callback) {
        unsubscribe = db
          .collection('trips')
          .doc(tripId)
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            callback,
          );
      }
    },

    subscribeToTripExpenseChange: (tripId, callback) => {
      if (!unsubscribe && tripId && callback) {
        unsubscribe = db
          .collection('trips')
          .doc(tripId)
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            callback,
          );
      }
    },

    unsubscribeToTripChange: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
  };
}

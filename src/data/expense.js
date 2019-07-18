import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default function trip() {
  const db = firebase.firestore();
  const { currentUser } = firebase.auth();

  return {
    submitExpense: expenseDetail => {
      // const batch = db.batch();
      const expenseRef = db.collection('expenses').doc();
      const tripRef = db.collection('trips').doc(expenseDetail.tripId);

      return db.runTransaction(transaction => {
        return transaction.get(tripRef).then(tripDoc => {
          if (!tripDoc.exists) {
            throw new Error('Document does not exist!');
          }

          const data = tripDoc.data();
          const categoryCost =
            (data.categories && data.categories[expenseDetail.category]) || 0;

          const tripDetail = {
            expenses: firebase.firestore.FieldValue.arrayUnion(expenseRef),
            categories: {
              ...data.categories,
              [expenseDetail.category]:
                parseFloat(categoryCost) + parseFloat(expenseDetail.amount),
            },
          };

          // throw new Error('Document does not exist!');
          transaction.update(tripRef, tripDetail);

          expenseDetail.payees.forEach(payee => {
            const userRef = db.collection('users').doc(payee);
            transaction.update(userRef, {
              expenses: firebase.firestore.FieldValue.arrayUnion(expenseRef),
            });
          });

          transaction.set(expenseRef, expenseDetail);
        });
      });
    },
  };
}

import 'firebase/auth';
import 'firebase/firestore';
import firebase from '@data/_db';

export default function expense() {
  const db = firebase.firestore();

  return {
    deleteReceipts: options => {
      return firebase.functions().httpsCallable('deleteReceipts')(options);
    },

    getExpenseReports: (expensesRefs = []) => {
      return Promise.all(expensesRefs.map(expensesRef => expensesRef.get()));
    },

    uploadReceipt: options => {
      return firebase.functions().httpsCallable('uploadReceipt')(options);
    },

    removeExpense: (expenseId, expenseObject) => {
      const expenseRef = db.collection('expenses').doc(expenseId);
      const tripRef = db.collection('trips').doc(expenseObject.tripId);

      return db.runTransaction(transaction => {
        return transaction.get(tripRef).then(tripDoc => {
          if (!tripDoc.exists) {
            throw new Error('Document does not exist!');
          }

          const data = tripDoc.data();
          const categoryCost =
            (data.costs && data.costs[expenseObject.category]) || 0;

          const costs = {
            ...data.costs,
            [expenseObject.category]:
              parseFloat(categoryCost) - parseFloat(expenseObject.amount),
          };

          transaction.update(tripRef, {
            expenses: firebase.firestore.FieldValue.arrayRemove(expenseRef),
            costs,
          });

          expenseObject.payees.forEach(payee => {
            const userRef = db.collection('users').doc(payee.id);

            transaction.update(userRef, {
              expenses: firebase.firestore.FieldValue.arrayRemove(expenseRef),
            });
          });

          return expenseRef.delete();
        });
      });
    },

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
            (data.costs && data.costs[expenseDetail.category]) || 0;
          const tripDetail = {
            expenses: firebase.firestore.FieldValue.arrayUnion(expenseRef),
            costs: {
              ...data.costs,
              [expenseDetail.category]:
                parseFloat(categoryCost) + parseFloat(expenseDetail.amount),
            },
          };

          transaction.update(tripRef, tripDetail);

          expenseDetail.payees.forEach(payee => {
            const userRef = db.collection('users').doc(payee.id);
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

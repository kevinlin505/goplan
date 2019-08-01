import 'firebase/auth';
import 'firebase/firestore';
import firebase from '@data/_db';

export default function trip() {
  const db = firebase.firestore();

  return {
    getExpenseReports: (expensesRefs = []) => {
      return Promise.all(expensesRefs.map(expensesRef => expensesRef.get()));
    },

    uploadReceipt: options => {
      return firebase.functions().httpsCallable('uploadReceipt')(options);
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

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();
const db = admin.firestore();

const leaveTrip = options => {
    const tripExpenses = options.tripExpenses;
    const batch = db.batch();
    const id = options.id;
    const currentUserRef = db.collection('users').doc(currentUser.uid);
    const tripRef = db.collection('trips').doc(id);
    const activityRef = db.collection('activities').doc(id);

    Object.keys(tripExpenses).forEach(expenseId => {
        const expenseRef = db.collection('expenses').doc(expenseId);    
        tripExpenses[expenseId].payees.forEach(payee => {
            const userRef = db.collection('users').doc(payee.id);        
            batch.update(userRef, {
                expenses: firebase.firestore.FieldValue.arrayRemove(expenseRef),
            });
        });
    });
    batch.update(currentUserRef, {
        trips: firebase.firestore.FieldValue.arrayRemove(tripRef),
    });
    batch.delete(tripRef);
    batch.delete(activityRef);
    
    batch.commit();
    console.log('leave trip done');
    return null;
}

module.exports = functions.https.onCall(options => {
    return leaveTrip(options);
});
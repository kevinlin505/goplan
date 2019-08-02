import 'firebase/auth';
import 'firebase/functions';
import firebase from '@data/_db';

export default function auth() {
  return {
    fetchSignInMethod: email => {
      return firebase.auth().fetchSignInMethodsForEmail(email);
    },

    getUnsplashImage: query => {
      return firebase.functions().httpsCallable('getUnsplashImage')(query);
    },

    sendInviteEmail: (inviteeEmail, tripId) => {
      const addMessage = firebase
        .functions()
        .httpsCallable('sendInvitationEmail');

      return addMessage({
        inviteeEmail,
        invitationLink: `https://goplan-3b4b1.web.app/#/trip/${tripId}`,
        inviterName: `John Doe`,
        inviterEmail: `Sample@test.com`,
      });
    },

    // register/login with google auth
    signInWithGoogleAuthAsync: () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      return firebase.auth().signInWithPopup(provider);
    },

    // login with facebook auth
    signInWithFacebookAuthAsync: () => {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');

      return firebase.auth().signInWithPopup(provider);
    },

    // Logout current user
    signOut: () => firebase.auth().signOut(),

    // Listener for auth change
    onStateChanged: callback => {
      firebase.auth().onAuthStateChanged(callback);
    },
  };
}

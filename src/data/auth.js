import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

export default function auth() {
  return {
    sendInviteEmail: (email, tripId) => {
      const addMessage = firebase
        .functions()
        .httpsCallable('sendInvitationEmail');

      return addMessage({
        email,
        invitationLink: `https://goplan-3b4b1.web.app/#/trip/${tripId}`,
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

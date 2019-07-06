import firebase from 'firebase/app';
import 'firebase/auth';

export default function auth() {
  return {
    // register/login with google auth
    signInWithGoogleAuthAsync: async () => {
      const provider = new firebase.auth.GoogleAuthProvider();

      const result = await firebase.auth().signInWithPopup(provider);

      if (result && result.code) {
        console.error(`${result.message} with: ${result.email}`);
      }

      return result;
    },

    // Logout current user
    signOut: () => firebase.auth().signOut(),

    // Listener for auth change
    onStateChanged: callback => {
      return firebase.auth().onAuthStateChanged(callback);
    },
  };
}

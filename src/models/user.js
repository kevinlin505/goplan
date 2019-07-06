import firebase from 'firebase/app';
import 'firebase/database';

const authUserProfile = currentUser => {
  return {
    displayName: currentUser.displayName,
    email: currentUser.email,
    emailVerified: currentUser.emailVerified,
    isAnonymous: currentUser.isAnonymous,
    creationTime: currentUser.metadata.creationTime,
    lastSignInTime: currentUser.metadata.lastSignInTime,
    phoneNumber: currentUser.phoneNumber,
    photoURL: currentUser.photoURL,
    accessToken: currentUser.accessToken,
    refreshToken: currentUser.refreshToken,
  };
};

export default function user() {
  return {
    checkUserProfile: currentUser => {
      console.log(currentUser);
    },

    createUserProfile: () => {
      const { currentUser } = firebase.auth();
      const profile = authUserProfile(currentUser);

      firebase
        .database()
        .ref(`users/${currentUser.uid}`)
        .set(profile);
    },

    updateUserProfile: (newProfile = {}) => {
      const { currentUser } = firebase.auth();
      const profile = {
        ...authUserProfile(currentUser),
        ...newProfile,
      };

      firebase
        .database()
        .ref(`users/${currentUser.uid}`)
        .update(profile);
    },
  };
}

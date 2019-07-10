import initializeFireBase from '@data/_db';
import auth from '@data/auth';
import user from '@data/user';
import firebase from 'firebase/app';

export const types = {
  AUTHENTICATION_ERROR: 'AUTH/AUTHENTICATION_ERROR',
  SIGN_IN: 'AUTH/SIGN_IN',
  SIGN_OUT: 'AUTH/SIGN_OUT',
};

const initialState = {
  isAuthenticated: false,
  authenticationError: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTHENTICATION_ERROR: {
      return {
        ...state,
        authenticationError: action.err,
      };
    }

    case types.SIGN_IN: {
      return {
        ...state,
        isAuthenticated: true,
        authenticationError: null,
      };
    }

    case types.SIGN_OUT: {
      return {
        ...state,
        isAuthenticated: false,
        authenticationError: null,
      };
    }

    default:
      return state;
  }
}

export const authActions = {
  checkAuth: () => dispatch => {
    initializeFireBase();

    auth().onStateChanged(currentUser => {
      if (currentUser && currentUser.uid) {
        return dispatch({
          type: types.SIGN_IN,
        });
      }
    });
  },

  signInGoogle:() => dispatch => {
    auth()
      .signInWithGoogleAuthAsync()
      .then(signInSuccessCallback(dispatch))
      .catch(signInErrorCallback(dispatch));
  },

  signInFacebook:() => dispatch => {
    auth()
      .signInWithFacebookAuthAsync()
      .then(signInSuccessCallback(dispatch))
      .catch(err => {
        if (err.code = 'auth/account-exists-with-different-credential'){
          const pendingCred = err.credential;
          const email = err.email;
          firebase.auth().fetchSignInMethodsForEmail(email)
            .then(methods => {
              if(methods[0] === 'google.com'){
                auth()
                  .signInWithGoogleAuthAsync()
                  .then(user => {
                    user.user.linkWithCredential(pendingCred);
                  })
                  .then(signInSuccessCallback(dispatch))
                  .catch(signInErrorCallback(dispatch));
                }
              })
          } 
      });
  },

  signOut: () => dispatch => {
    auth()
      .signOut()
      .then(() => {
        return dispatch({
          type: types.SIGN_OUT,
        });
      });
  },
};

const signInSuccessCallback = dispatch => {
  return (
    () => {
      user()
        .checkUserProfile()
        .then(profile => {
          if (!profile.exists) {
            user().createUserProfile();
          }

          return dispatch({
            type: types.SIGN_IN,
          });
        });
    })
}

const signInErrorCallback = dispatch => {
  return (
    err => {
      return dispatch({
        type: types.AUTHENTICATION_ERROR,
        err,
      });
    }
  )
}
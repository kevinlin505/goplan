import firebase from 'firebase/app';
import initializeFireBase from '@data/_db';
import auth from '@data/auth';
import user from '@data/user';

export const types = {
  AUTHENTICATION_ERROR: 'AUTH/AUTHENTICATION_ERROR',
  SIGN_IN: 'AUTH/SIGN_IN',
  SIGN_OUT: 'AUTH/SIGN_OUT',
  UPDATE_PROFILE: 'AUTH/UPDATE_PROFILE',
};

const initialState = {
  authenticationError: null,
  isAuthenticated: false,
  profile: null,
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
        authenticationError: null,
        isAuthenticated: true,
        profile: action.profile,
      };
    }

    case types.SIGN_OUT: {
      return {
        ...state,
        authenticationError: null,
        isAuthenticated: false,
      };
    }

    case types.UPDATE_PROFILE: {
      return {
        ...state,
        profile: action.profile,
      };
    }

    default:
      return state;
  }
}

export const authActions = {
  checkAuth: () => dispatch => {
    if(!firebase.apps.length) initializeFireBase();

    auth().onStateChanged(currentUser => {
      if (currentUser && currentUser.uid) {
        user()
          .checkUserProfile()
          .then(profile => {
            return dispatch({
              type: types.SIGN_IN,
              profile: profile.data(),
            });
          });

        // Listen to user profile update and update the local profile if changes are made to server
        user().subscribeToProfileChange(profile => {
          if (!profile.metadata.hasPendingWrites) {
            dispatch({
              type: types.UPDATE_PROFILE,
              profile: profile.data(),
            });
          }
        });
      } else {
        user().unsubscribeToProfileChange();
      }
    });
  },

  signInWithGoogleAuth: () => dispatch => {
    auth()
      .signInWithGoogleAuthAsync()
      .then(() => {
        dispatch(authActions.signInSuccess());
      })
      .catch(() => {
        dispatch(authActions.signInError());
      });
  },

  // login with facebook auth
  signInWithFacebookAuth: () => dispatch => {
    auth()
      .signInWithFacebookAuthAsync()
      .then(() => {
        dispatch(authActions.signInSuccess());
      })
      .catch(err => {
        if (err.code === 'auth/account-exists-with-different-credential') {
          const pendingCred = err.credential;
          const { email } = err;
          return firebase
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then(methods => {
              if (methods[0] === 'google.com') {
                auth()
                  .signInWithGoogleAuthAsync()
                  .then(profile => {
                    profile.user.linkWithCredential(pendingCred);
                  })
                  .then(() => {
                    dispatch(authActions.signInSuccess());
                  })
                  .catch(() => {
                    dispatch(authActions.signInError());
                  });
              }
            });
        }

        return dispatch(authActions.signInError());
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

  signInSuccess: () => dispatch => {
    return user()
      .checkUserProfile()
      .then(profile => {
        if (!profile.exists) {
          user().createUserProfile();
        }

        return dispatch({
          type: types.SIGN_IN,
        });
      });
  },

  signInError: () => dispatch => {
    return err => {
      return dispatch({
        type: types.AUTHENTICATION_ERROR,
        err,
      });
    };
  },
};

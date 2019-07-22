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
  userId: null,
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
        userId: action.uid,
      };
    }

    case types.SIGN_OUT: {
      return {
        ...state,
        authenticationError: null,
        isAuthenticated: false,
        profile: null,
        userId: null,
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
    auth().onStateChanged(currentUser => {
      if (currentUser && currentUser.uid) {
        dispatch(authActions.signInSuccess(currentUser.uid));

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
      .then(authData => {
        dispatch(authActions.signInSuccess(authData.uid));
      })
      .catch(() => {
        dispatch(authActions.signInError());
      });
  },

  // login with facebook auth
  signInWithFacebookAuth: () => dispatch => {
    auth()
      .signInWithFacebookAuthAsync()
      .then(authData => {
        dispatch(authActions.signInSuccess(authData.uid));
      })
      .catch(err => {
        if (err.code === 'auth/account-exists-with-different-credential') {
          const pendingCred = err.credential;
          const { email } = err;

          return auth()
            .fetchSignInMethod(email)
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

  signInSuccess: uid => dispatch => {
    user()
      .checkUserProfile()
      .then(profile => {
        if (!profile.exists) {
          user().createUserProfile();
        }
        return dispatch({
          type: types.SIGN_IN,
          profile: profile.data(),
          uid,
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

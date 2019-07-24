import auth from '@data/auth';
import user from '@data/user';
import AuthState from '@constants/AuthState';

export const types = {
  AUTHENTICATION_ERROR: 'AUTH/AUTHENTICATION_ERROR',
  CHECK_AUTHENTICATION: 'AUTH/CHECK_AUTHENTICATION',
  SIGN_IN: 'AUTH/SIGN_IN',
  SIGN_OUT: 'AUTH/SIGN_OUT',
  UPDATE_PROFILE: 'AUTH/UPDATE_PROFILE',
};

const initialState = {
  isAuthenticated: AuthState.UNKOWN,
  profile: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.CHECK_AUTHENTICATION: {
      return {
        ...state,
        isAuthenticated: action.status,
      };
    }

    case types.SIGN_IN: {
      return {
        ...state,
        authenticationError: null,
        isAuthenticated: AuthState.AUTHENTICATED,
        profile: action.profile,
      };
    }

    case types.SIGN_OUT: {
      return {
        ...state,
        authenticationError: null,
        isAuthenticated: AuthState.UNAUTHENTICATED,
        profile: null,
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
  checkAuth: () => (dispatch, getState) => {
    const { isAuthenticated } = getState().auth;

    auth().onStateChanged(currentUser => {
      if (currentUser) {
        dispatch(authActions.signInSuccess(currentUser.uid));
      } else if (isAuthenticated === AuthState.UNKOWN) {
        dispatch({
          type: types.CHECK_AUTHENTICATION,
          status: AuthState.UNAUTHENTICATED,
        });
      }
    });
  },

  signInWithGoogleAuth: () => dispatch => {
    return auth()
      .signInWithGoogleAuthAsync()
      .catch(() => {
        return dispatch(authActions.signInError());
      });
  },

  // login with facebook auth
  signInWithFacebookAuth: () => dispatch => {
    return auth()
      .signInWithFacebookAuthAsync()
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
                    return profile.user.linkWithCredential(pendingCred);
                  })
                  .catch(() => {
                    return dispatch(authActions.signInError());
                  });
              }
            });
        }

        return dispatch(authActions.signInError());
      });
  },

  signOut: () => dispatch => {
    return auth()
      .signOut()
      .then(() => {
        return dispatch({
          type: types.SIGN_OUT,
        });
      });
  },

  signInSuccess: uid => dispatch => {
    return user()
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

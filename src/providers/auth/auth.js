import initializeFireBase from '@data/_db';
import auth from '@data/auth';
import user from '@data/user';

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

  signInGoogle: () => dispatch => {
    auth()
      .signInWithGoogleAuthAsync()
      .then(() => {
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
      .catch(err => {
        return dispatch({
          type: types.AUTHENTICATION_ERROR,
          err,
        });
      });
  },

  signInFacebook: () => dispatch => {
    auth()
      .signInWithFacebookAuthAsync()
      .then(() => {
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
      .catch(err => {
        return dispatch({
          type: types.AUTHENTICATION_ERROR,
          err,
        });
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

import initializeFireBase from '@models/_db';
import auth from '@models/auth';
import user from '@models/user';

export const types = {
  AUTH_ERROR: 'AUTH_ERROR',
  GET_USER_DETAILS: 'GET_USER_DETAILS',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
};

const initialState = {
  isAuthenticated: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_DETAILS: {
      return {
        ...state,
      };
    }

    case types.SIGN_IN: {
      return {
        ...state,
        isAuthenticated: true,
      };
    }

    case types.SIGN_OUT: {
      return {
        ...state,
        isAuthenticated: false,
      };
    }

    default:
      return state;
  }
}

export const actions = {
  checkAuth: async () => {
    const result = await auth().onStateChanged(data => {
      console.log(data);
    });
  },

  signIn: () => async dispatch => {
    await initializeFireBase();

    const result = await auth().signInWithGoogleAuthAsync();

    if (result && result.credential && result.user) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      const authUser = result.user;

      user().checkUserProfile(authUser);

      return dispatch({
        type: types.SIGN_IN,
        token,
        user,
      });
    }

    return dispatch({
      type: types.AUTH_ERROR,
    });
  },

  signOut: () => async dispatch => {
    await auth().signOut();

    return dispatch({
      type: types.SIGN_OUT,
    });
  },

  getUserDetails: () => (dispatch, getState) => {
    return dispatch({
      type: types.GET_USER_DETAILS,
    });
  },
};

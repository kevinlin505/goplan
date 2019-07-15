import user from '@data/user';

export const types = {
  GET_USER_DETAILS: 'USER/GET_USER_DETAILS',
  UPDATE_USER_DETAILS: 'USER/UPDATE_USER_DETAILS',
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_DETAILS: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

export const userActions = {
  getUserDetails: () => dispatch => {
    return dispatch({
      type: types.GET_USER_DETAILS,
    });
  },

  updateProfile: profile => dispatch => {
    user()
      .updateUserProfile(profile)
      .then(
        dispatch({
          type: types.UPDATE_USER_DETAILS,
        }),
      );
  },
};

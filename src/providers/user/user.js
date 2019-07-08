import user from '@data/user';

export const types = {
  GET_USER_DETAILS: 'USER/GET_USER_DETAILS',
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

  updateProfile: profile => {
    user().updateUserProfile(profile);
  },
};

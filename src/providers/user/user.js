export const types = {
  GET_USER_DETAILS: 'GET_USER_DETAILS',
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

export const actions = {
  getUserDetails: () => (dispatch, getState) => {
    return dispatch({
      type: types.GET_USER_DETAILS,
    });
  },
};

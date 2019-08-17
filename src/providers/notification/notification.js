export const types = {
  SET_NOTIFICATION: 'NOTIFICATION/SET_NOTIFICATION',
};

const initialState = {
  status: '',
  message: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_NOTIFICATION: {
      return {
        ...state,
        status: action.status,
        message: action.message,
      };
    }

    default:
      return state;
  }
}

export const notificationActions = {
  setNotification: (status, message) => ({
    type: types.SET_NOTIFICATION,
    message,
    status,
  }),
};

import user from '@data/user';

export const types = {
  GET_ALL_ATTENDEES: 'USER/GET_ALL_ATTENDEES',
  GET_USER_DETAILS: 'USER/GET_USER_DETAILS',
  UPDATE_USER_DETAILS: 'USER/UPDATE_USER_DETAILS',
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_ATTENDEES: {
      return {
        ...state,
        users: action.attendees,
      };
    }
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
  // fetch all attendee of a trip and dispatch it to the store
  getAllAttendees: attendeeRefs => dispatch => {
    user()
      .getAllAttendees(attendeeRefs)
      .then(docs => {
        const attendees = docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });

        dispatch({
          type: types.GET_ALL_ATTENDEES,
          attendees,
        });
      });
  },

  getUsersDetails: () => dispatch => {
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

import user from '@data/user';

export const types = {
  GET_ALL_ATTENDEES: 'USER/GET_ALL_ATTENDEES',
  UPDATE_USER_DETAILS: 'USER/UPDATE_USER_DETAILS',
};

const initialState = {
  users: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_ALL_ATTENDEES: {
      return {
        ...state,
        users: action.attendees,
      };
    }

    default:
      return state;
  }
}

export const userActions = {
  // fetch all attendee of a trip and dispatch it to the store
  getAllAttendees: attendeeObjects => dispatch => {
    user()
      .getAllAttendees(attendeeObjects)
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

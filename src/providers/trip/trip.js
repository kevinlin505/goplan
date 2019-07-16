import auth from '@data/auth';
import trip from '@data/trip';

export const types = {
  CREATE_TRIP: 'TRIP/CREATE_TRIP',
  JOIN_TRIP: 'TRIP/JOIN_TRIP',
  RETRIEVE_ALL_TRIPS: 'TRIP/RETRIEVE_ALL_TRIPS',
  SET_SELECTED_TRIP: 'TRIP/SET_SELECTED_TRIP',
  UPDATE_INVITE_TRIP_ID: 'TRIP/UPDATE_INVITE_TRIP_ID',
  UPDATE_TRIP: 'TRIP/UPDATE_TRIP',
};

const initialState = {
  joinTripId: null,
  selectedTrip: null,
  trips: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TRIP: {
      return {
        ...state,
      };
    }

    case types.UPDATE_INVITE_TRIP_ID: {
      return {
        ...state,
        joinTripId: action.joinTripId,
      };
    }

    case types.RETRIEVE_ALL_TRIPS: {
      return {
        ...state,
        trips: action.trips,
      };
    }

    case types.SET_SELECTED_TRIP: {
      return {
        ...state,
        selectedTrip: action.selectedTrip,
      };
    }

    default:
      return state;
  }
}

export const tripActions = {
  createTrip: formDetail => dispatch => {
    const inviteList = formDetail.attendees;
    const tripDetail = {
      ...formDetail,
      attendees: [],
      end_date: new Date(formDetail.end_date),
      start_date: new Date(formDetail.start_date),
    };

    return trip()
      .createTrip(tripDetail)
      .then(tripId => {
        Promise.all(
          inviteList.map(attendee => {
            return auth().sendInviteEmail(attendee, tripId);
          }),
        );

        return dispatch({
          type: types.CREATE_TRIP,
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  getAllTrips: tripRefs => dispatch => {
    trip()
      .getAllTrips(tripRefs)
      .then(docs => {
        const trips = docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          return data;
        });

        dispatch({
          type: types.RETRIEVE_ALL_TRIPS,
          trips,
        });
      });
  },

  getTrip: tripRef => dispatch => {
    trip()
      .getTrip(tripRef)
      .then(tripDetails => {
        dispatch({
          type: types.SET_SELECTED_TRIP,
          selectedTrip: tripDetails.data(),
        });
      });
  },

  joinTrip: tripId => dispatch => {
    trip()
      .joinTrip(tripId)
      .then(() => {
        dispatch({
          type: types.JOIN_TRIP,
        });
      });
  },

  updateJoinTripId: tripId => dispatch => {
    dispatch({
      type: types.UPDATE_INVITE_TRIP_ID,
      joinTripId: tripId,
    });
  },

  updateTrip: (tripId, tripDetail) => dispatch => {
    trip()
      .updateTrip(tripId, tripDetail)
      .then(() => {
        dispatch({
          type: types.UPDATE_TRIP,
        });
      });
  },
};

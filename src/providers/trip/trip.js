import firebase from 'firebase/app';
import 'firebase/firestore';
import auth from '@data/auth';
import trip from '@data/trip';

export const types = {
  CREATE_TRIP: 'TRIP/CREATE_TRIP',
  RETRIEVE_ALL_TRIPS: 'TRIP/RETRIEVE_ALL_TRIPS',
  SET_SELECTED_TRIP: 'TRIP/SET_SELECTED_TRIP',
};

const initialState = {
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
      end_date: formDetail.end_date,
      start_date: formDetail.start_date,
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
};

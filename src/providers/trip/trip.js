import firebase from 'firebase/app';
import 'firebase/firestore';
import trip from '@data/trip';

export const types = {
  CREATE_TRIP: 'TRIP/CREATE_TRIP',
  SET_SELECTED_TRIP: 'TRIP/SET_SELECTED_TRIP',
};

const initialState = {
  selectedTrip: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TRIP: {
      return {
        ...state,
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
  createTrip: formDetails => dispatch => {
    const tripDetails = {
      ...formDetails,
      destinations: [
        {
          country: 'Peru',
          geo: new firebase.firestore.GeoPoint(-72.5471516, -13.1631412),
          name: 'Machu Picchu',
        },
      ],
      end_date: new Date(2019, 8, 20).getTime(),
      estimate_budget_per_person: 2000,
      expenses: [],
      name: 'Trip to Peru',
      notes: 'Backpacking trip to Machu Picchu.',
      spending: 0,
      start_date: new Date(2019, 7, 31).getTime(),
    };

    trip()
      .createTrip(tripDetails)
      .then(() => {
        console.log('trip created');
        dispatch({
          type: types.CREATE_TRIP,
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  getTrip: tripDoc => dispatch => {
    trip()
      .getTrip(tripDoc)
      .then(tripDetails => {
        dispatch({
          type: types.SET_SELECTED_TRIP,
          selectedTrip: tripDetails.data(),
        });
      });
  },
};

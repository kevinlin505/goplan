import auth from '@data/auth';
import trip from '@data/trip';
import expense from '@data/expense';

export const types = {
  CREATE_TRIP: 'TRIP/CREATE_TRIP',
  GET_DESTINATION_PHOTO: 'TRIP/GET_DESTINATION_PHOTO',
  GET_TRIP_EXPENSE_REPORTS: 'EXPENSE/GET_TRIP_EXPENSE_REPORTS',
  JOIN_TRIP: 'TRIP/JOIN_TRIP',
  RETRIEVE_ALL_TRIPS: 'TRIP/RETRIEVE_ALL_TRIPS',
  SET_SELECTED_TRIP: 'TRIP/SET_SELECTED_TRIP',
  TOGGLE_NEW_TRIP_MODAL: 'TRIP/TOGGLE_NEW_TRIP_MODAL',
  UPDATE_FORM: 'TRIP/UPDATE_FORM',
  UPDATE_TRIP: 'TRIP/UPDATE_TRIP',
};

const initialState = {
  form: {
    attendees: [],
    destinations: [],
    name: '',
    notes: '',
  },
  isNewTripModalOpen: false,
  selectedTrip: null,
  tripExpenses: {},
  trips: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_TRIP: {
      return {
        ...state,
      };
    }

    case types.GET_TRIP_EXPENSE_REPORTS: {
      return {
        ...state,
        tripExpenses: action.reports,
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

    case types.TOGGLE_NEW_TRIP_MODAL: {
      return {
        ...state,
        isNewTripModalOpen: action.isNewTripModalOpen,
      };
    }

    case types.UPDATE_FORM: {
      return {
        ...state,
        form: action.updatedForm,
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
      costs: {},
      expenses: [],
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
      .then(tripDocs => {
        const trips = tripDocs.reduce((tripMap, tripDoc) => {
          tripMap[tripDoc.data().id] = tripDoc.data();

          return tripMap;
        }, {});

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

  getTripExpenses: expenseRefs => dispatch => {
    return expense()
      .getExpenseReports(expenseRefs)
      .then(expenseDocs => {
        const reports = expenseDocs.reduce((reportData, report) => {
          reportData[report.id] = report.data();

          return reportData;
        }, {});

        dispatch({
          type: types.GET_TRIP_EXPENSE_REPORTS,
          reports,
        });
      });
  },

  getUnsplashImage: options => dispatch => {
    trip()
      .getUnsplashImage(options)
      .then(response => {
        console.log(response);

        return dispatch({
          type: types.GET_DESTINATION_PHOTO,
        });
      });
  },

  joinTrip: tripId => (dispatch, getState) => {
    const { profile } = getState().auth;
    trip()
      .joinTrip(tripId, profile)
      .then(() => {
        dispatch({
          type: types.JOIN_TRIP,
        });
      });
  },

  toggleNewTripModal: () => (dispatch, getState) => {
    const { isNewTripModalOpen } = getState().trip;

    return dispatch({
      type: types.TOGGLE_NEW_TRIP_MODAL,
      isNewTripModalOpen: !isNewTripModalOpen,
    });
  },

  updateForm: (name, value) => (dispatch, getState) => {
    const { form } = getState().trip;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    dispatch({
      type: types.UPDATE_FORM,
      updatedForm,
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

import auth from '@data/auth';
import trip from '@data/trip';
import expense from '@data/expense';
import getTravelDates from '@utils/calculateTravelDates';

export const types = {
  CREATE_TRIP: 'TRIP/CREATE_TRIP',
  GET_DESTINATION_PHOTO: 'TRIP/GET_DESTINATION_PHOTO',
  GET_TRIP_EXPENSE_REPORTS: 'TRIP/GET_TRIP_EXPENSE_REPORTS',
  INVITE_TRIP: 'TRIP/INVITE_TRIP',
  JOIN_TRIP: 'TRIP/JOIN_TRIP',
  LEAVE_TRIP: 'TRIP/LEAVE_TRIP',
  RETRIEVE_ALL_TRIPS: 'TRIP/RETRIEVE_ALL_TRIPS',
  SET_SELECTED_TRIP: 'TRIP/SET_SELECTED_TRIP',
  TOGGLE_NEW_TRIP_MODAL: 'TRIP/TOGGLE_NEW_TRIP_MODAL',
  UPDATE_FORM: 'TRIP/UPDATE_FORM',
  UPDATE_TRIP: 'TRIP/UPDATE_TRIP',
};

const initialState = {
  form: {
    attendees: [],
    costs: {},
    destinations: [],
    expenses: [],
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
  createTrip: () => (dispatch, getState) => {
    const {
      auth: { profile },
      trip: { form },
    } = getState();

    const inviteList = form.attendees;
    const organizer = {
      email: profile.email,
      id: profile.id,
      name: profile.name,
    };
    const tripDetail = {
      ...form,
      attendees: [organizer],
      organizer,
    };

    return trip()
      .createTrip(tripDetail)
      .then(tripId => {
        Promise.all(
          inviteList.map(attendee => {
            return auth().sendInviteEmail(
              attendee,
              tripId,
              tripDetail.name,
              getTravelDates(tripDetail),
            );
          }),
        );

        dispatch({
          type: types.CREATE_TRIP,
        });

        return dispatch(tripActions.toggleNewTripModal());
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
          const tripData = tripDoc.data();

          // calculate overall travel date
          const traveDates = getTravelDates(tripData);

          tripData.travelDates = traveDates;
          tripMap[tripDoc.data().id] = tripData;

          return tripMap;
        }, {});

        return dispatch({
          type: types.RETRIEVE_ALL_TRIPS,
          trips,
        });
      });
  },

  getTrip: tripRef => dispatch => {
    return trip()
      .getTrip(tripRef)
      .then(tripDetails => {
        const tripData = tripDetails.data();
        tripData.travelDates = getTravelDates(tripData);

        return dispatch({
          type: types.SET_SELECTED_TRIP,
          selectedTrip: tripData,
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

        return dispatch({
          type: types.GET_TRIP_EXPENSE_REPORTS,
          reports,
        });
      });
  },

  getUnsplashImage: options => dispatch => {
    return trip()
      .getUnsplashImage(options)
      .then(response => {
        dispatch({
          type: types.GET_DESTINATION_PHOTO,
        });

        return Promise.resolve(response.data);
      })
      .catch(() => {
        return Promise.resolve('');
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

  inviteTrip: (email, tripId, tripName, tripDates) => dispatch => {
    dispatch({
      type: types.INVITE_TRIP,
    });

    return auth().sendInviteEmail(email, tripId, tripName, tripDates);
  },

  leaveTrip: (tripId, attendee) => dispatch => {
    dispatch({
      type: types.LEAVE_TRIP,
    });

    return trip().leaveTrip(tripId, attendee);
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

  removeDestination: position => (dispatch, getState) => {
    const { form } = getState().trip;

    const updatedForm = {
      ...form,
      destinations: [
        ...form.destinations.slice(0, position),
        ...form.destinations.slice(position + 1),
      ],
    };

    dispatch({
      type: types.UPDATE_FORM,
      updatedForm,
    });
  },

  removeAttendee: position => (dispatch, getState) => {
    const { form } = getState().trip;

    const updatedForm = {
      ...form,
      attendees: [
        ...form.attendees.slice(0, position),
        ...form.attendees.slice(position + 1),
      ],
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

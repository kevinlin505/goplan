import { cloneDeep } from 'lodash';
import activity from '@data/activity';
import trip from '@data/trip';
import expense from '@data/expense';
import user from '@data/user';
import ActivityType from '@constants/ActivityType';
import getTravelDates from '@utils/calculateTravelDates';

export const types = {
  CLEAR_TRIP_FORM: 'TRIP/CLEAR_TRIP_FORM',
  CREATE_TRIP: 'TRIP/CREATE_TRIP',
  DELETE_TRIP: 'TRIP/DELETE_TRIP',
  GET_DESTINATION_PHOTO: 'TRIP/GET_DESTINATION_PHOTO',
  GET_MEMBERS: 'TRIP/GET_MEMBERS',
  GET_TRIP_EXPENSE_REPORTS: 'TRIP/GET_TRIP_EXPENSE_REPORTS',
  GET_WEATHER_INFO: 'TRIP/GET_WEATHER_INFO',
  INVITE_TRIP: 'TRIP/INVITE_TRIP',
  JOIN_TRIP: 'TRIP/JOIN_TRIP',
  LEAVE_TRIP: 'TRIP/LEAVE_TRIP',
  POPULATE_TRIP_FORM: 'TRIP/POPULATE_TRIP_FORM',
  RETRIEVE_ALL_TRIPS: 'TRIP/RETRIEVE_ALL_TRIPS',
  SET_SELECTED_TRIP: 'TRIP/SET_SELECTED_TRIP',
  TOGGLE_EDIT_TRIP_MODAL: 'TRIP/TOGGLE_EDIT_TRIP_MODAL',
  TOGGLE_NEW_TRIP_MODAL: 'TRIP/TOGGLE_NEW_TRIP_MODAL',
  UPDATE_FORM: 'TRIP/UPDATE_FORM',
  UPDATE_TRIP: 'TRIP/UPDATE_TRIP',
};

const initialState = {
  form: {
    costs: {},
    destinations: [],
    expenses: [],
    invites: [],
    members: {},
    name: '',
    notes: '',
  },
  isNewTripModalOpen: false,
  isEditTripModalOpen: false,
  selectedTrip: null,
  tripExpenses: {},
  trips: {},
  weatherCache: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.CLEAR_TRIP_FORM: {
      return {
        ...state,
        form: action.form,
      };
    }

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

    case types.POPULATE_TRIP_FORM: {
      return {
        ...state,
        form: action.form,
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

    case types.TOGGLE_EDIT_TRIP_MODAL: {
      return {
        ...state,
        isEditTripModalOpen: action.isEditTripModalOpen,
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

    case types.UPDATE_TRIP: {
      return {
        ...state,
        selectedTrip: {
          ...state.selectedTrip,
          ...action.tripDetail,
        },
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

    const organizer = {
      email: profile.email,
      id: profile.id,
      name: profile.name,
    };
    const tripDetail = {
      ...form,
      members: {
        [profile.id]: organizer,
      },
      organizer,
    };

    return trip()
      .createTrip(tripDetail)
      .then(tripId => {
        activity().createActivity(tripId);

        Promise.all(
          form.invites.map(member => {
            return trip().sendInviteEmail(
              member,
              tripId,
              tripDetail.name,
              getTravelDates(tripDetail),
            );
          }),
        ).then(() => {
          activity().updateActivity(ActivityType.INVITE_TRIP, tripId, {
            emails: form.invites,
          });
        });

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

  getMembers: memberList => dispatch => {
    return user()
      .getMembers(memberList)
      .then(docs => {
        const members = docs.reduce((obj, doc) => {
          const data = doc.data();
          obj[data.id] = data;

          return obj;
        }, {});

        dispatch({
          type: types.GET_MEMBERS,
        });

        return Promise.resolve(members);
      });
  },

  getTrip: tripRef => dispatch => {
    return trip()
      .getTrip(tripRef)
      .then(tripDoc => {
        const tripDetails = tripDoc.data();

        return dispatch(tripActions.getMembers(tripDetails.members)).then(
          membersList => {
            tripDetails.members = membersList;

            tripDetails.travelDates = getTravelDates(tripDetails);

            dispatch({
              type: types.SET_SELECTED_TRIP,
              selectedTrip: tripDetails,
            });

            return Promise.resolve(tripDetails);
          },
        );
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

  getWeather: (latitude, longitude) => (dispatch, getState) => {
    const { weatherCache } = getState().trip;
    const cacheKey = `${latitude}, ${longitude}`;

    if (weatherCache[cacheKey] !== undefined) {
      const cachedWeather = weatherCache[cacheKey];
      const now = new Date().getTime();
      const thirtyMin = 1000 * 60 * 30;
      const diff = now - cachedWeather.time.getTime();
      if (diff < thirtyMin) {
        dispatch({
          type: types.GET_WEATHER_INFO,
        });

        return Promise.resolve(cachedWeather.data);
      }
    }

    return trip()
      .getWeather(latitude, longitude)
      .then(response => {
        weatherCache[cacheKey] = {
          data: response.data,
          time: new Date(),
        };

        dispatch({
          type: types.GET_WEATHER_INFO,
        });

        return Promise.resolve(response.data);
      })
      .catch(() => {
        return Promise.resolve('');
      });
  },

  joinTrip: tripId => (dispatch, getState) => {
    const { profile } = getState().auth;

    return trip()
      .joinTrip(tripId, profile)
      .then(() => {
        activity().updateActivity(ActivityType.JOIN_TRIP, tripId);

        return dispatch({
          type: types.JOIN_TRIP,
        });
      });
  },

  inviteTrip: (email, tripId, tripName, tripDates) => dispatch => {
    dispatch({
      type: types.INVITE_TRIP,
    });

    return trip()
      .sendInviteEmail(email, tripId, tripName, tripDates)
      .then(() => {
        activity().updateActivity(ActivityType.INVITE_TRIP, tripId, {
          emails: [email],
        });
      });
  },

  leaveTrip: tripId => (dispatch, getState) => {
    const { selectedTrip, tripExpenses } = getState().trip;

    if (Object.keys(selectedTrip.members).length === 1) {
      return trip()
        .deleteTrip(selectedTrip, tripExpenses)
        .then(() => {
          debugger;
          return dispatch({
            type: types.DELETE_TRIP,
          });
        });
    }

    return trip()
      .leaveTrip(tripId)
      .then(() => {
        activity().updateActivity(ActivityType.LEAVE_TRIP, tripId);

        return dispatch({
          type: types.LEAVE_TRIP,
        });
      });
  },

  toggleEditTripModal: () => (dispatch, getState) => {
    const { isEditTripModalOpen } = getState().trip;

    return dispatch({
      type: types.TOGGLE_EDIT_TRIP_MODAL,
      isEditTripModalOpen: !isEditTripModalOpen,
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

  removeMember: position => (dispatch, getState) => {
    const { form } = getState().trip;

    const updatedForm = {
      ...form,
      invites: [
        ...form.invites.slice(0, position),
        ...form.invites.slice(position + 1),
      ],
    };

    dispatch({
      type: types.UPDATE_FORM,
      updatedForm,
    });
  },

  subscribeToTripChange: tripId => (dispatch, getState) => {
    trip().subscribeToTripChange(tripId, tripSnapshot => {
      if (tripSnapshot.exists && !tripSnapshot.metadata.hasPendingWrites) {
        const { selectedTrip } = getState().trip;
        const { members, ...tripDetail } = tripSnapshot.data();

        tripDetail.members = Object.keys(members).reduce((obj, memberId) => {
          obj[memberId] = {
            ...selectedTrip.members[memberId],
            ...members[memberId],
          };

          return obj;
        }, {});

        dispatch({
          type: types.UPDATE_TRIP,
          tripDetail,
        });
      }
    });
  },

  unsubscribeToTripChange: () => () => {
    trip().unsubscribeToTripChange();
  },

  updateTrip: () => (dispatch, getState) => {
    const {
      auth: { profile },
      trip: {
        form,
        selectedTrip: { members },
      },
    } = getState();

    const memberEmails = Object.values(members).map(member => member.email);

    const organizer = {
      email: profile.email,
      id: profile.id,
      name: profile.name,
    };
    const tripDetail = {
      ...form,
      members: {
        [profile.id]: organizer,
      },
    };

    return trip()
      .updateTrip(tripDetail)
      .then(() => {
        activity().updateActivity(ActivityType.UPDATE_TRIP, tripDetail.id);

        Promise.all(
          form.invites.map(memberEmail => {
            if (!memberEmails.includes(memberEmail)) {
              return trip().sendInviteEmail(
                memberEmail,
                tripDetail.id,
                tripDetail.name,
                getTravelDates(tripDetail),
              );
            }

            return undefined;
          }),
        ).then(() => {
          activity().updateActivity(ActivityType.INVITE_TRIP, tripDetail.id, {
            emails: form.invites,
          });
        });

        dispatch({
          type: types.UPDATE_TRIP,
        });

        return dispatch(tripActions.toggleEditTripModal());
      })
      .catch(err => {
        console.log(err);
      });
  },

  populateTripForm: () => (dispatch, getState) => {
    const {
      trip: { selectedTrip },
    } = getState();

    dispatch({
      type: types.POPULATE_TRIP_FORM,
      form: cloneDeep(selectedTrip),
    });

    return dispatch(tripActions.toggleEditTripModal());
  },

  clearTripForm: () => dispatch => {
    dispatch({
      type: types.CLEAR_TRIP_FORM,
      form: initialState.form,
    });

    return dispatch(tripActions.toggleNewTripModal());
  },
};

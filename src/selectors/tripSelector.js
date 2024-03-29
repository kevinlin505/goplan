import createDeepEqualSelector from '@utils/cacheHelper';

export const getExpenseIdList = state =>
  state.trip.selectedTrip.expenses.map(ele => ele.id);

export const getTripList = state => state.auth.profile.trips;

export const getParamTripId = (state, props) => props.match.params.tripId;

export const getTripStatus = createDeepEqualSelector(
  [getTripList, getParamTripId],
  (tripList, paramTripId) => tripList.some(el => el.id === paramTripId),
);

export const getUserId = state => state.auth.profile.id;
export const getMembers = state =>
  state.trip.selectedTrip && state.trip.selectedTrip.members;
export const getMember = createDeepEqualSelector(
  [getMembers, getUserId],
  (members, userId) =>
    members && members.filter(member => member.id === userId)[0],
);

export const getTrips = state => state.trip.trips;

export const getFormattedTrips = createDeepEqualSelector([getTrips], trips =>
  Object.keys(trips).reduce(
    (splittedTrips, tripId) => {
      const trip = trips[tripId];
      const now = new Date().getTime();
      const endOfDay = 24 * 60 * 60 * 1000;

      if (now > trip.travelDates.endAt + endOfDay) {
        splittedTrips.previous.push(trip);
      } else {
        splittedTrips.current.push(trip);
      }

      return splittedTrips;
    },
    {
      current: [],
      previous: [],
    },
  ),
);

export const getSortedTrips = createDeepEqualSelector(
  [getFormattedTrips],
  ({ current, previous }) => {
    return {
      current: current.sort(
        (t1, t2) => t1.travelDates.startAt - t2.travelDates.startAt,
      ),
      previous: previous.sort(
        (t1, t2) => t2.travelDates.endAt - t1.travelDates.endAt,
      ),
    };
  },
);

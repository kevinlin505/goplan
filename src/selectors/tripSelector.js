import createDeepEqualSelector from '@utils/cacheHelper';

export const getTripList = state => state.auth.profile.trips;

export const getParamTripId = (state, props) => props.match.params.tripId;

export const getTripStatus = createDeepEqualSelector(
  [getTripList, getParamTripId],
  (tripList, paramTripId) => tripList.some(el => el.id === paramTripId),
);

export const getTrips = state => state.trip.trips;

export const getFormattedTrips = createDeepEqualSelector([getTrips], trips =>
  Object.keys(trips).reduce(
    (splittedTrips, tripId) => {
      const trip = trips[tripId];
      const now = new Date().getTime();

      if (now > trip.travelDates.endAt) {
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

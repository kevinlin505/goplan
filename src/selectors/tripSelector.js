import createDeepEqualSelector from '@utils/cacheHelper';

const getTripList = state => state.auth.profile.trips;

const getJoinTripId = state => state.trip.joinTripId;

const getTripStatus = createDeepEqualSelector(
  [getTripList, getJoinTripId],
  (tripList, joinTripId) => tripList.some(el => el.id === joinTripId),
);

export default getTripStatus;

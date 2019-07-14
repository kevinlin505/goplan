import createDeepEqualSelector from '@utils/cache_helper';

const getTripList = state => state.auth.profile.trips;

const getJoinTripId = joinTripId => joinTripId;

const getTripStatus = createDeepEqualSelector(
  getTripList,
  getJoinTripId,
  (tripList, joinTripId) => {
    return tripList.some(el => {
      return el.id === joinTripId;
    });
  },
);

export default getTripStatus;

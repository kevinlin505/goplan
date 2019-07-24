import createDeepEqualSelector from '@utils/cacheHelper';

export const getTripList = state => state.auth.profile.trips;

export const getParamTripId = (state, props) => props.match.params.tripId;

export const getTripStatus = createDeepEqualSelector(
  [getTripList, getParamTripId],
  (tripList, paramTripId) => tripList.some(el => el.id === paramTripId),
);

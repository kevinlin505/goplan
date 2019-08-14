import activity from '@data/activity';
import ActivityType from '@constants/ActivityType';

export const types = {
  UPDATE_ACTIVITY: 'ACTIVITY/UPDATE_ACTIVITY',
};

const initialState = {
  tripsActivityList: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_ACTIVITY: {
      return {
        ...state,
        tripsActivityList: {
          ...state.tripsActivityList,
          [action.tripId]: {
            ...state.tripsActivityList[action.tripId],
            ...action.activities,
          },
        },
      };
    }

    default:
      return state;
  }
}

export const activityActions = {
  sendMessage: (tripId, message) => () => {
    return activity().updateActivity(ActivityType.MESSAGE, tripId, {
      message,
    });
  },

  subscribeToActivityChange: tripId => dispatch => {
    activity().subscribeToActivityChange(tripId, activitySnapshot => {
      if (
        activitySnapshot.exists &&
        !activitySnapshot.metadata.hasPendingWrites
      ) {
        dispatch({
          type: types.UPDATE_ACTIVITY,
          tripId: activitySnapshot.data().tripId,
          activities: activitySnapshot.data(),
        });
      }
    });
  },

  unsubscribeToActivityChange: () => () => {
    activity().unsubscribeToActivityChange();
  },
};

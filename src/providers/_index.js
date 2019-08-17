import { combineReducers } from 'redux';
import auth, { types as AuthTypes } from '@providers/auth/auth';
import activity from '@providers/activity/activity';
import expense from '@providers/expense/expense';
import notification from '@providers/notification/notification';
import trip from '@providers/trip/trip';
import user from '@providers/user/user';

const appReducer = combineReducers({
  activity,
  auth,
  expense,
  notification,
  trip,
  user,
});

const rootReducer = (state, action) => {
  if (action.type === AuthTypes.SIGN_OUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

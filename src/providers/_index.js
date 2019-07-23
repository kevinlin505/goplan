import { combineReducers } from 'redux';
import auth, { types as AuthTypes } from '@providers/auth/auth';
import expense from '@providers/expense/expense';
import trip from '@providers/trip/trip';
import user from '@providers/user/user';

const appReducer = combineReducers({
  auth,
  expense,
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

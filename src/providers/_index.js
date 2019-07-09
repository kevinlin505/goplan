import { combineReducers } from 'redux';
import auth from '@providers/auth/auth';
import trip from '@providers/trip/trip';
import user from '@providers/user/user';

export default combineReducers({
  auth,
  trip,
  user,
});

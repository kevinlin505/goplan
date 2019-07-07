import { combineReducers } from 'redux';
import auth from '@providers/auth/auth';
import user from '@providers/user/user';

export default combineReducers({
  auth,
  user,
});

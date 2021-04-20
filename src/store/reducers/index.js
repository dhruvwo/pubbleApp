import {combineReducers} from 'redux';
import {auth} from './auth';
import {collections} from './collections';
import {events} from './events';
import {myInbox} from './myInbox';

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
  collections,
  events,
  myInbox,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;

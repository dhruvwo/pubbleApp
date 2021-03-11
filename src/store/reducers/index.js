import {combineReducers} from 'redux';
import {auth} from './auth';

// combine reducers to build the state
const appReducer = combineReducers({
  auth,
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

export default rootReducer;

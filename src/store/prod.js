import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';

const middleware = [thunk];
// eslint-disable-next-line no-underscore-dangle
const configureStore = () =>
  createStore(reducers, applyMiddleware(...middleware));

export default configureStore;

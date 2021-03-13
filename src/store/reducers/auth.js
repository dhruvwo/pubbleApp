import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  user: {},
  community: {},
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case AuthState.SET_INIT:
      return {
        ...state,
        initData: action.data,
      };
    case AuthState.SET_USER:
      AsyncStorage.setItem('user', JSON.stringify(action.data));
      return {
        ...state,
        user: action.data,
      };
    case AuthState.SET_COMMUNITY:
      return {
        ...state,
        community: action.data,
      };
    case AuthState.CLEAR_USER:
      AsyncStorage.clear();
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

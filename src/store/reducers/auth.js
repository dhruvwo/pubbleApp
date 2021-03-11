import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case AuthState.SET_KEY:
      AsyncStorage.setItem('apiServiceResponse', JSON.stringify(action.data));
      return {
        ...state,
        apiServiceResponse: action.data,
      };
    case AuthState.SET_USER:
      AsyncStorage.setItem(
        'authenticationResponse',
        JSON.stringify(action.data),
      );
      return {
        ...state,
        authenticationResponse: action.data,
      };
    case AuthState.SET_USER_SETUP:
      AsyncStorage.setItem('userSetup', JSON.stringify(action.data));
      return {
        ...state,
        userSetup: action.data,
      };
    case AuthState.CLEAR_USER:
      AsyncStorage.removeItem('authenticationResponse');
      AsyncStorage.removeItem('userSetup');
      return {
        ...state,
        authenticationResponse: '',
        userSetup: '',
      };
    default:
      return state;
  }
};

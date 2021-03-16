import {auth} from '../../services/api';
import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';
import {navigate} from '../../navigation/RootNavigation';

const setUser = (data) => ({
  type: AuthState.SET_USER,
  data,
});

const setCommunity = (data) => ({
  type: AuthState.SET_COMMUNITY,
  data,
});

const setEvents = (data) => ({
  type: AuthState.SET_EVENTS,
  data,
});

const setSelectedEvent = (data) => ({
  type: AuthState.SET_SELECTED_EVENT,
  data,
});

const clearUser = () => ({
  type: AuthState.CLEAR_USER,
});

const login = (loginData) => {
  return (dispatch) => {
    return auth
      .login(loginData)
      .then((response) => {
        if (response.code === 200) {
          const finalRes = {
            accountId: response.accountId,
            data: response.data,
          };
          dispatch(setUser(finalRes));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in login action', err);
        return err.response;
      });
  };
};

const getCommunityData = (shortName) => {
  return (dispatch) => {
    return auth
      .getCommunityData(shortName)
      .then((response) => {
        if (response.code === 200) {
          dispatch(setCommunity(response.data));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in init api after login action', err);
        return err.response;
      });
  };
};

const logout = () => {
  return (dispatch) => {
    dispatch(clearUser());
    AsyncStorage.clear();
    navigate('Login', {
      reset: true,
    });
    return true;
  };
};

export const authAction = {
  setUser,
  login,
  getCommunityData,
  setSelectedEvent,
  logout,
};

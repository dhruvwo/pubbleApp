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

const initAfterLogin = (shortName) => {
  return (dispatch) => {
    return auth
      .initAfterLogin(shortName)
      .then((response) => {
        if (response.code === 200) {
          dispatch(setCommunity(response));
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
  initAfterLogin,
  logout,
};

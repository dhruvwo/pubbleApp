import {auth} from '../../services/api';
import {AuthState} from '../../constants/GlobalState';
import {navigate} from '../../RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';

const setUser = (data) => ({
  type: AuthState.SET_USER,
  data,
});

const setInitAfterLogin = (data) => ({
  type: AuthState.SET_INIT,
  data,
});

const clearUser = () => ({
  type: AuthState.CLEAR_USER,
});

const login = (bodyFormData) => {
  return (dispatch) => {
    return auth
      .login(bodyFormData)
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

const initAfterLogin = () => {
  return (dispatch) => {
    return auth
      .initAfterLogin()
      .then((response) => {
        if (response.code === 200) {
          dispatch(setInitAfterLogin(response));
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

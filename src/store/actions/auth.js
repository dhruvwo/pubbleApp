// import {auth} from '../../services/api';
import {AuthState} from '../../constants/GlobalState';
import {navigate} from '../../RootNavigation';
import AsyncStorage from '@react-native-community/async-storage';

const setUser = (data) => ({
  type: AuthState.SET_USER,
  data,
});

const clearUser = () => ({
  type: AuthState.CLEAR_USER,
});

const login = (email, password) => {
  return (dispatch) => {
    // return auth
    //   .login(email, password)
    //   .then((response) => {
    //     if (response.status === 'success' && response.authenticated === true) {
    //       dispatch(setUser(response.AuthenticationResponse));
    //     }
    //     return response;
    //   })
    //   .catch((err) => {
    //     console.error('error in login action', err);
    //     return err.response;
    //   });
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
  logout,
};

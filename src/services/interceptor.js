import axios from 'axios';
import {authAction} from '../store/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastService from './Toast';

export const axiosInterceptor = (dispatch) => {
  axios.interceptors.request.use(
    async (request) => {
      let apiServiceResponse = await AsyncStorage.getItem('apiServiceResponse');
      let authenticationResponse = await AsyncStorage.getItem(
        'authenticationResponse',
      );
      apiServiceResponse = JSON.parse(apiServiceResponse);
      authenticationResponse = JSON.parse(authenticationResponse);

      // You can modify or control request
      request.headers = {
        ...request.headers,
        'Content-Type': 'application/json',
      };
      if (
        apiServiceResponse &&
        apiServiceResponse.serviceId &&
        apiServiceResponse.key
      ) {
        request.headers = {
          ...request.headers,
          'X-Paid-Service-Id': apiServiceResponse.serviceId,
          'X-Paid-Service-Key': apiServiceResponse.key,
        };
      }

      if (authenticationResponse && authenticationResponse.token) {
        request.headers = {
          ...request.headers,
          // 'X-Paid-Service-Id': '',
          // 'X-Paid-Service-Key': '',
          'X-Paid-User-Session-Id': authenticationResponse.callerId,
          'X-Paid-User-Session-Key': authenticationResponse.sessionKey,
          'X-Paid-User-Token': authenticationResponse.token,
          'X-Paid-User-Username': authenticationResponse.email,
        };
      }

      return request;
    },
    (err) => {
      console.error('error in interceptor request!!', err);
      // Handle errors
      throw err;
    },
  );
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const status =
        error.response && error.response.status && error.response.status;
      if (status === 403) {
        if (!error?.response?.config?.url.includes('/accounts/authenticate')) {
          dispatch(authAction.logout());
          ToastService({
            message:
              error.response.message ||
              'Your session has expired please log back in',
          });
        }
      }
      return Promise.reject(error);
    },
  );
};

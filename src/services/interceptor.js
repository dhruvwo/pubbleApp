import axios from 'axios';
import {authAction} from '../store/actions';
import ToastService from './Toast';

export const axiosInterceptor = (dispatch) => {
  axios.interceptors.request.use(
    async (request) => {
      // You can modify or control request
      request.headers = {
        ...request.headers,
        'Content-Type': 'application/json',
      };
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

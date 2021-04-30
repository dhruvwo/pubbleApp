import axios from 'axios';
import {authAction} from '../store/actions';
import store from '../store';
import ToastService from './utilities/ToastService';

export const axiosInterceptor = () => {
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
      manageRes(response);
      return response;
    },
    (error) => {
      manageRes(error);
      return Promise.reject(error);
    },
  );

  function manageRes(response) {
    const status = response.data && response.data?.code;
    if (status === 406) {
      ToastService({
        message: 'Your session has expired please log back in',
      });
      store.dispatch(authAction.logout());
    }
  }
};

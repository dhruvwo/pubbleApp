import {API_URL} from '../../../env.json';
import axios from 'axios';

const login = async (bodyFormData) => {
  return axios
    .request({
      method: 'post',
      url: `${API_URL}/signin`,
      data: bodyFormData,
      headers: {'Content-Type': 'multipart/form-data'},
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const initAfterLogin = async () => {
  return axios
    .get(`${API_URL}/dashboard/init`)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const auth = {
  login,
  initAfterLogin,
};

import {API_URL} from '../../../env.json';
import axios from 'axios';

const login = async (loginData) => {
  var bodyFormData = new FormData();
  bodyFormData.append('email', loginData.email);
  bodyFormData.append('password', loginData.password);
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

const initAfterLogin = async (shortName) => {
  const params = {
    shortName,
  };
  return axios
    .get(`${API_URL}/dashboard/init`, {
      params,
    })
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

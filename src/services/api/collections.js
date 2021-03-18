import {API_URL} from '../../../env.json';
import axios from 'axios';

const getDirectoryData = async (params) => {
  return axios
    .get(`${API_URL}/community/subscriber/directory`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const collections = {
  getDirectoryData,
};

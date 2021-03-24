import {API_URL} from '../../../env.json';
import axios from 'axios';

const getDirectoryData = async (params) => {
  const directoryType = params.appIds ? 'app' : 'subscriber';
  return axios
    .get(`${API_URL}/community/${directoryType}/directory`, {
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

import axios from 'axios';
import {API_URL} from '../../../env.json';

const getTranslation = async (params) => {
  return axios
    .get(`${API_URL}/post/translate/save`, {
      /* .get(`https://pubble-translators.azurewebsites.net/translator`, { */
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const translations = {
  getTranslation,
};

import axios from 'axios';

const getTranslation = async (params) => {
  return axios
    .get(`https://pubble-translators.azurewebsites.net/translator`, {
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

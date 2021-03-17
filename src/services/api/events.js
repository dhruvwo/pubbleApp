import {API_URL} from '../../../env.json';
import axios from 'axios';

const getStreamData = async (params) => {
  return axios
    .get(`${API_URL}/dashboard/stream`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const getCountsData = async (params) => {
  return axios
    .get(`${API_URL}/stream/me/count`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const updateStar = async (params, type) => {
  return axios
    .get(`${API_URL}/post/${type}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const events = {
  getStreamData,
  getCountsData,
  updateStar,
};

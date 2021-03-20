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

const approveDisapproveStreamData = async (params, UrlSlug) => {
  return axios
    .get(`${API_URL}/post/${UrlSlug}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const deleteStreamData = async (params) => {
  return axios
    .get(`${API_URL}/post/delete`, {
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
    .get(`${API_URL}/app/message/count`, {
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

const lockStream = async (params, type) => {
  return axios
    .get(`${API_URL}/conversation/${type}`, {
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
  approveDisapproveStreamData,
  deleteStreamData,
  lockStream,
  updateStar,
};

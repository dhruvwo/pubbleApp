import {API_URL} from '../../../env.json';
import axios from 'axios';

const getStream = async (params) => {
  // const params = {
  //   communityId: 2904,
  //   contentType: 'JSONP',
  //   postTypes: 'Q',
  //   scope: 'all',
  //   pageSize: 10,
  //   statuses: '10,20,40',
  //   includeUnapproved: true,
  //   searchAppIds: 21332,
  // };
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

export const auth = {
  getStream,
};

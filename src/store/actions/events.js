import {events} from '../../services/api';

const getStreamData = (params) => {
  return (dispatch) => {
    return events
      .getStreamData(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in login action', err);
        return err.response;
      });
  };
};

export const eventsAction = {
  getStreamData,
};

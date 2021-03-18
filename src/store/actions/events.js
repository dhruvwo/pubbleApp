import {EventsState} from '../../constants/GlobalState';
import {events} from '../../services/api';

const setStream = (data) => ({
  type: EventsState.SET_STREAM,
  data,
});

const getStreamData = (params) => {
  return (dispatch) => {
    return events
      .getStreamData(params)
      .then((response) => {
        dispatch(setStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const getCountsData = (params) => {
  return (dispatch) => {
    return events
      .getCountsData(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in getCountsData action', err);
        return err.response;
      });
  };
};

const updateStar = (params, type) => {
  return (dispatch) => {
    return events
      .updateStar(params, type)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateStar action', err);
        return err.response;
      });
  };
};

export const eventsAction = {
  getStreamData,
  getCountsData,
  updateStar,
};

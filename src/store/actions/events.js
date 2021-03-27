import {EventsState} from '../../constants/GlobalState';
import {events} from '../../services/api';

const setStream = (data) => ({
  type: EventsState.SET_STREAM,
  data,
});

const approveDisapprove = (data) => ({
  type: EventsState.APPROVE_DISAPPROVE_STREAM,
  data,
});

const deleteStream = (data) => ({
  type: EventsState.DELETE_STREAM,
  data,
});

const starStream = (data) => ({
  type: EventsState.STAR_STREAM,
  data,
});

const lockStreamFunc = (data) => ({
  type: EventsState.LOCK_STREAM,
  data,
});

const closeStream = (data) => ({
  type: EventsState.CLOSE_STREAM,
  data,
});

const updateAssigne = (data) => ({
  type: EventsState.UPDATE_ASSIGN,
  data,
});

const unAssign = (data) => ({
  type: EventsState.REMOVE_ASSIGN,
  data,
});

const updateAssigneData = (params) => {
  return (dispatch) => {
    return events
      .updateAssigneData(params)
      .then((response) => {
        dispatch(updateAssigne(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateAssigneData action', err);
        return err.response;
      });
  };
};

const removeAssignee = (params) => {
  return (dispatch) => {
    return events
      .removeAssignee(params)
      .then((response) => {
        dispatch(unAssign(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in removeAssignee action', err);
        return err.response;
      });
  };
};

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

const lockStream = (params, type) => {
  return (dispatch) => {
    return events
      .lockStream(params, type)
      .then((response) => {
        dispatch(lockStreamFunc(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateStar action', err);
        return err.response;
      });
  };
};

const updateStar = (params, type, reducerParam) => {
  return (dispatch) => {
    return events
      .updateStar(params, type)
      .then((response) => {
        dispatch(starStream(reducerParam));
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateStar action', err);
        return err.response;
      });
  };
};

const approveDisapproveStreamData = (params, UrlSlug) => {
  return (dispatch) => {
    return events
      .approveDisapproveStreamData(params, UrlSlug)
      .then((response) => {
        dispatch(approveDisapprove(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const deleteStreamData = (params) => {
  return (dispatch) => {
    return events
      .deleteStreamData(params)
      .then((response) => {
        dispatch(deleteStream(params));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const closeStreamData = (params) => {
  return (dispatch) => {
    return events
      .closeStreamData(params)
      .then((response) => {
        dispatch(closeStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

export const eventsAction = {
  getStreamData,
  approveDisapproveStreamData,
  deleteStreamData,
  lockStream,
  getCountsData,
  updateStar,
  closeStreamData,
  updateAssigneData,
  removeAssignee,
};

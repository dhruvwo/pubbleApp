import {EventsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  stream: [],
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case EventsState.SET_STREAM:
      return {
        ...state,
        stream: action.data.data,
        totalStream: action.data.total,
      };
    case EventsState.APPROVE_DISAPPROVE_STREAM:
      const streamIndex = _.findIndex(state.stream, {id: action.data.id});
      let data = [...state.stream];
      data[streamIndex] = action.data;
      return {
        ...state,
        stream: data,
      };
    case EventsState.CLOSE_STREAM:
      const closestreamIndex = _.findIndex(state.stream, {id: action.data.id});
      let closeData = [...state.stream];
      closeData[closestreamIndex] = action.data;
      return {
        ...state,
        stream: closeData,
      };
    case EventsState.DELETE_STREAM:
      const streamData = _.remove(state.stream, function (val) {
        return val.id !== action.data.postId;
      });
      return {
        ...state,
        stream: [...streamData],
      };
    case EventsState.STAR_STREAM:
      const allStarData = _.findIndex(state.stream, {
        conversationId: action.data.conversationId,
      });

      let getStarData = [...state.stream];
      let oldStarData = getStarData[allStarData];
      if (action.data.type === 'unstar') {
        let updateStarData = oldStarData.starred.filter(
          (star) => star !== action.data.userId,
        );
        oldStarData.starred = updateStarData;
      } else {
        oldStarData.starred = [...oldStarData.starred, action.data.userId];
      }
      getStarData[allStarData] = oldStarData;

      return {
        ...state,
        stream: getStarData,
      };
    case EventsState.LOCK_STREAM:
      const loclStreamIndex = _.findIndex(state.stream, {id: action.data.id});
      let lockData = [...state.stream];
      lockData[loclStreamIndex] = action.data;
      return {
        ...state,
        stream: lockData,
      };
    default:
      return state;
  }
};

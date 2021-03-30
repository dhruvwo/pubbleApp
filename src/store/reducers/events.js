import {EventsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  stream: [],
  currentPage: 0,
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case EventsState.SET_STREAM:
      return {
        ...state,
        stream:
          action.data.currentPage === 1
            ? action.data.data
            : [...state.stream, ...action.data.data],
        totalStream: action.data.total,
        currentPage: action.data.currentPage,
      };
    case EventsState.APPROVE_DISAPPROVE_STREAM:
      const streamIndex = _.findIndex(state.stream, {id: action.data.id});
      let data = [...state.stream];
      data[streamIndex] = action.data;
      return {
        ...state,
        stream: data,
      };
    case EventsState.CLOSE_POLL_VOTING:
      const pollDataIndex = _.findIndex(state.stream, {id: action.data.id});
      let pollData = [...state.stream];
      pollData[pollDataIndex] = action.data;
      return {
        ...state,
        stream: pollData,
      };
    case EventsState.CLOSE_STREAM:
      const closeStreamData = _.remove(state.stream, function (val) {
        return val.conversationId !== action.data.conversationId;
      });
      return {
        ...state,
        stream: [...closeStreamData],
      };
    case EventsState.UPDATE_ASSIGN:
      return {
        ...state,
      };
    case EventsState.REMOVE_ASSIGN:
      return {
        ...state,
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
      const index = _.findIndex(state.stream, {
        conversationId: action.data.conversationId,
      });
      if (state.stream[index]) {
        state.stream[index].star = action.data.type === 'star';
      }
      return {
        ...state,
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

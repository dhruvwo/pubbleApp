import {EventsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  stream: [],
  currentPage: 0,
  streamInbox: [],
  currentInboxPage: 0,
  selectedTagFilter: null,
  filterParams: {
    New: {
      status: '',
      assin: '',
    },
    'In Progress': {
      status: '',
      wait: '',
    },
    Closed: {
      status: '',
    },
  },
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
    case EventsState.SET_INBOX_STREAM:
      return {
        ...state,
        streamInbox:
          action.data.currentPage === 1
            ? action.data.data
            : [...state.stream, ...action.data.data],
        totalInboxStream: action.data.total,
        currentInboxPage: action.data.currentPage,
      };

    case EventsState.UPDATE_STREAM:
      const streamIndex = _.findIndex(state.stream, {id: action.data.id});
      let data = [...state.stream];
      data[streamIndex] = action.data;
      return {
        ...state,
        stream: data,
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
    case EventsState.ADD_NEW_ANNOUNCEMENT:
      return {
        ...state,
        stream: [action.data, ...state.stream],
      };
    // case EventsState.GET_STATE_COUNTRY_IP:
    //   console.log(action.data, 'action ====');
    // return {
    //   ...state,
    //   stream: [action.data, ...state.stream],
    // };
    case EventsState.UPDATE_STREAM_AUTHOR_DATA:
      let streamClone = [...state.stream];
      const updateStreamIndex = _.findIndex(streamClone, {
        id: action.data.id,
      });
      if (action.data?.data?.name) {
        action.data.data.alias = action.data.data.name;
      }
      if (streamClone[updateStreamIndex]) {
        streamClone[updateStreamIndex].author = {
          ...streamClone[updateStreamIndex].author,
          ...action.data.data,
        };
      }
      return {
        ...state,
        stream: streamClone,
      };
    case EventsState.ADD_NEW_TAGS:
      const getTagIndex = _.findIndex(state.stream, {
        id: action.data.objectId,
      });
      let getTagOldData = [...state.stream];
      getTagOldData[getTagIndex].tagSet = [
        ...getTagOldData[getTagIndex].tagSet,
        ...action.data.data,
      ];
      return {
        ...state,
        stream: getTagOldData,
      };
    case EventsState.SELECTED_TAG_OPTION:
      return {
        ...state,
        selectedTagFilter: action.data,
      };
    case EventsState.FILTER_PARAMS:
      const filterParams = state.filterParams;
      if (action.data.activeTab && action.data.type) {
        filterParams[action.data.activeTab][action.data.type] =
          action.data.value || '';
      }
      return {
        ...state,
        filterParams,
      };
    case EventsState.UPDATE_PUBLISH_POST:
      const dataIndex = _.findIndex(state.stream, {id: action.data.id});
      let publishData = [...state.stream];
      publishData[dataIndex] = action.data;
      return {
        ...state,
        stream: publishData,
      };
    default:
      return state;
  }
};

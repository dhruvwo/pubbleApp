import {EventsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  stream: [],
  currentPage: 0,
  filterStateUpdated: 0,
  streamInbox: [],
  currentInboxPage: 0,
  selectedTagFilter: [],
  searchFilter: null,
  filterParams: {
    New: {
      status: '',
      assign: '',
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
      if (action.data) {
        const newStream = state.stream.filter(
          (item) => item.id !== action.data.id,
        );
        return {
          ...state,
          stream: [...newStream, action.data],
        };
      } else {
        return {
          ...state,
        };
      }

    case EventsState.REMOVE_ASSIGN:
      if (action.data.statusCode === 200) {
        const remainingStream = state.stream.filter(
          (item) => item.conversationId !== action.data.data.conversationId,
        );
        const streamData = state.stream.find((item) => {
          return item.conversationId === action.data.data.conversationId;
        });
        streamData.assignees = streamData.assignees.filter(
          (item) => item.id !== action.data.data.assigneeId,
        );

        return {
          ...state,
          stream: [...remainingStream, streamData],
        };
      } else {
        return {
          ...state,
        };
      }
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
    case EventsState.SET_FILTER_DATA:
      const filterData = action.data;
      return {
        ...state,
        searchFilter: filterData.type === 'search' ? filterData.data : null,
        selectedTagFilter: filterData.type === 'tag' ? filterData.data : [],
        filterStateUpdated: state.filterStateUpdated + 1,
      };
    case EventsState.CLEAR_FILTER_DATA:
      return {
        ...state,
        searchFilter: null,
        selectedTagFilter: [],
        filterStateUpdated: state.filterStateUpdated + 1,
      };
    case EventsState.FILTER_PARAMS:
      const filterParams = state.filterParams;
      if (action.data.activeTab && action.data.type) {
        filterParams[action.data.activeTab][action.data.type] =
          action.data.value || '';
      }
      const filterStateUpdated = state.filterStateUpdated + 1;
      return {
        ...state,
        filterParams,
        filterStateUpdated,
      };
    case EventsState.UPDATE_PUBLISH_POST:
      const publishData = _.remove(state.stream, function (val) {
        return val.id !== action.data;
      });
      return {
        ...state,
        stream: [...publishData],
      };
    default:
      return state;
  }
};

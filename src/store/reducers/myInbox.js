import {MyInboxState} from '../../constants/GlobalState';
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

export const myInbox = (state = initialState, action) => {
  switch (action.type) {
    case MyInboxState.SET_INBOX_STREAM_DATA:
      return {
        ...state,
        stream:
          action.data.currentPage === 1
            ? action.data.data
            : [...state.stream, ...action.data.data],
        totalStream: action.data.total,
        currentPage: action.data.currentPage,
      };

    case MyInboxState.UPDATE_INBOX_STREAM:
      const streamIndex = _.findIndex(state.stream, {id: action.data.id});
      let data = [...state.stream];
      data[streamIndex] = action.data;
      return {
        ...state,
        stream: data,
      };
    case MyInboxState.CLOSE_INBOX_STREAM:
      const closeStreamData = _.remove(state.stream, function (val) {
        return val.conversationId !== action.data.conversationId;
      });
      return {
        ...state,
        stream: [...closeStreamData],
      };
    case MyInboxState.UPDATE_INBOX_ASSIGN:
      let newStream = state.stream;
      if (action.data) {
        const selectedStream = state.stream.findIndex(
          (item) => item.id === action.data.id,
        );
        if (selectedStream >= 0) {
          newStream[selectedStream] = action.data;
        }
      }
      return {
        ...state,
        stream: newStream,
      };
    case MyInboxState.REMOVE_INBOX_ASSIGN:
      let newStreamData = state.stream;
      if (action.data.statusCode === 200) {
        const remainingStream = state.stream.findIndex(
          (item) => item.conversationId === action.data.data.conversationId,
        );
        if (remainingStream >= 0) {
          const streamData = state.stream[remainingStream];
          streamData.assignees = streamData.assignees.filter(
            (item) => item.id !== action.data.data.assigneeId,
          );
          newStreamData[remainingStream] = streamData;
        }
      }
      return {
        ...state,
        stream: newStreamData,
      };

    case MyInboxState.DELETE_INBOX_STREAM:
      const streamData = _.remove(state.stream, function (val) {
        return val.id !== action.data.postId;
      });
      return {
        ...state,
        stream: [...streamData],
      };
    case MyInboxState.STAR_INBOX_STREAM:
      let starStreamData = state.stream;
      const index = _.findIndex(starStreamData, {
        conversationId: action.data.conversationId,
      });
      if (starStreamData[index]) {
        starStreamData[index].star = action.data.type === 'star';
      }
      return {
        ...state,
        stream: starStreamData,
      };
    case MyInboxState.ADD_NEW_INBOX_ANNOUNCEMENT:
      return {
        ...state,
        stream: [action.data, ...state.stream],
      };
    // case MyInboxState.GET_STATE_COUNTRY_IP:
    //   console.log(action.data, 'action ====');
    // return {
    //   ...state,
    //   stream: [action.data, ...state.stream],
    // };
    case MyInboxState.UPDATE_INBOX_STREAM_AUTHOR_DATA:
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
    case MyInboxState.ADD_NEW_INBOX_TAGS:
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
    case MyInboxState.SET_INBOX_FILTER_DATA:
      const filterData = action.data;
      console.log('filterData', filterData);
      return {
        ...state,
        searchFilter: filterData.type === 'search' ? filterData.data : null,
        selectedTagFilter: filterData.type === 'tag' ? filterData.data : [],
        filterStateUpdated: state.filterStateUpdated + 1,
      };
    case MyInboxState.CLEAR_INBOX_FILTER_DATA:
      return {
        ...state,
        searchFilter: null,
        selectedTagFilter: [],
        filterStateUpdated: state.filterStateUpdated + 1,
      };
    case MyInboxState.INBOX_FILTER_PARAMS:
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
    case MyInboxState.UPDATE_INBOX_PUBLISH_POST:
      const publishData = _.remove(state.stream, function (val) {
        return val.id !== action.data;
      });
      return {
        ...state,
        stream: [...publishData],
      };
    case MyInboxState.SOCKET_UPDATE_STREAM:
      const socketStreamIndex = _.findIndex(state.stream, {
        id: action.data.id,
      });
      let getStreamOldData = [...state.stream];
      if (socketStreamIndex > 0) {
        if (action.data?.metadata?.action) {
          getStreamOldData[socketStreamIndex]['star'] =
            action.data.metadata.action === 'star';
        } else {
          getStreamOldData[socketStreamIndex] = action.data;
        }
      }
      return {
        ...state,
        stream: getStreamOldData,
      };
    default:
      return state;
  }
};

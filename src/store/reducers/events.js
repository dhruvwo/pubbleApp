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
  currentCard: {},
  currentTask: null,
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case EventsState.SET_STREAM:
      let currentCardData = setCurrentCard(state.currentCard, action.data.data);
      return {
        ...state,
        stream:
          action.data.currentPage === 1
            ? action.data.data
            : [...state.stream, ...action.data.data],
        totalStream: action.data.total,
        currentPage: action.data.currentPage,
        currentCard: currentCardData,
      };
    case EventsState.UPDATE_STREAM:
      let currentCardData_UPDATE_STREAM = setCurrentCard(state.currentCard, [
        action.data,
      ]);

      const streamIndex = _.findIndex(state.stream, {id: action.data.id});
      let data = [...state.stream];
      data[streamIndex] = action.data;
      return {
        ...state,
        stream: data,
        currentCard: currentCardData_UPDATE_STREAM,
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
      let currentCardData_UPDATE_ASSIGN = setCurrentCard(state.currentCard, [
        action.data,
      ]);
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
        currentCard: currentCardData_UPDATE_ASSIGN,
      };
    case EventsState.REMOVE_ASSIGN:
      let newStreamData = state.stream;
      if (action.data.statusCode === 200 && action.data.data) {
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

    case EventsState.DELETE_STREAM:
      const streamData = _.remove(state.stream, function (val) {
        return val.id !== action.data.postId;
      });
      return {
        ...state,
        stream: [...streamData],
      };
    case EventsState.STAR_STREAM:
      let currentCardData_STAR_STREAM = setCurrentCard(
        state.currentCard,
        action.data.data,
      );
      const index = _.findIndex(state.stream, {
        conversationId: action.data.conversationId,
      });
      if (state.stream[index]) {
        state.stream[index].star = action.data.type === 'star';
      }
      return {
        ...state,
        currentCard: currentCardData_STAR_STREAM,
      };
    case EventsState.ADD_NEW_ANNOUNCEMENT:
      let currentCardData_ADD_NEW_ANNOUNCEMENT = setCurrentCard(
        state.currentCard,
        action.data.data,
      );
      return {
        ...state,
        stream: [action.data, ...state.stream],
        currentCard: currentCardData_ADD_NEW_ANNOUNCEMENT,
      };
    // case EventsState.GET_STATE_COUNTRY_IP:
    //   console.log(action.data, 'action ====');
    // return {
    //   ...state,
    //   stream: [action.data, ...state.stream],
    // };
    case EventsState.UPDATE_STREAM_AUTHOR_DATA:
      let currentCardData_UPDATE_STREAM_AUTHOR_DATA = setCurrentCard(
        state.currentCard,
        [action.data],
      );
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
        currentCard: currentCardData_UPDATE_STREAM_AUTHOR_DATA,
      };
    case EventsState.ADD_NEW_TAGS:
      let currentCardData_ADD_NEW_TAGS = setCurrentCard(
        state.currentCard,
        action.data.data,
      );
      const getTagIndex = _.findIndex(state.stream, {
        id: action.data.objectId,
      });
      let getTagOldData = [...state.stream];
      if (getTagIndex >= 0) {
        getTagOldData[getTagIndex].tagSet = [
          ...getTagOldData[getTagIndex].tagSet,
          ...action.data.data,
        ];
      }
      return {
        ...state,
        stream: getTagOldData,
        currentCard: currentCardData_ADD_NEW_TAGS,
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
    case EventsState.CURRENT_CARD:
      return {
        ...state,
        currentCard: action.data,
      };
    case EventsState.UPDATE_POLL:
      let currentCardData_UPDATE_POLL = setCurrentCard(state.currentCard, [
        action.data,
      ]);
      let pollData = state.stream;
      const pollIndex = _.findIndex(pollData, {
        id: action.data.id,
      });
      pollData[pollIndex] = action.data;
      return {
        ...state,
        stream: pollData,
        currentCard: currentCardData_UPDATE_POLL,
      };
    case EventsState.SET_TASK:
      return {
        ...state,
        currentTask: action.data,
      };
    case EventsState.DELETE_TASK:
      return {
        ...state,
        currentTask: null,
      };
    default:
      return state;
  }
};

function setCurrentCard(currentCard, streamData) {
  if (currentCard?.id) {
    const streamIndex = _.findIndex(streamData, {
      id: currentCard.id,
    });
    if (streamIndex >= 0 && streamData[streamIndex]) {
      return {...currentCard, ...streamData[streamIndex]};
    }
  }
  return currentCard;
}

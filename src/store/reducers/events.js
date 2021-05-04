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
  notification: {
    events: {
      123: {
        taskIds: [1, 2],
        new: 1,
        inProgress: 2,
      },
    },
    myInbox: {
      taskIds: [1, 2, 3],
      draft: 3,
      published: 5,
    },
  },
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
      let currentStreamData;
      if (action.data.statusCode === 200 && action.data.data) {
        const remainingStream = state.stream.findIndex(
          (item) => item.conversationId === action.data.data.conversationId,
        );
        if (remainingStream >= 0) {
          currentStreamData = state.stream[remainingStream];
          currentStreamData.assignees = currentStreamData.assignees.filter(
            (item) => item.id !== action.data.data.assigneeId,
          );
          newStreamData[remainingStream] = currentStreamData;
        }
      }
      return {
        ...state,
        stream: newStreamData,
        currentCard: currentStreamData,
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
      console.log('currentCardData_STAR_STREAM', currentCardData_STAR_STREAM);
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
    case EventsState.SOCKET_UPDATE_POLL:
      if (action.data.length) {
        action.data.forEach((pollData) => {
          let totalVotes = 0;
          let allStreamData = state.stream;
          const streamDataIndex = allStreamData.findIndex(
            (item) => item.id === pollData.sourceId,
          );
          let pollStreamData = allStreamData[streamDataIndex];
          pollStreamData.attachments.forEach((item) => {
            totalVotes = totalVotes + item.votes;
          });
          const attachmentDataIndex = state.stream.findIndex(
            (item) => item.id === pollData.targetId,
          );
          pollStreamData.attachments[attachmentDataIndex].votes =
            attachmentData?.votes + 1;
          pollStreamData.attachments[attachmentDataIndex].voted = true;
          pollStreamData.attachments.forEach(
            (item) => (item.percentage = (item.votes / (totalVotes + 1)) * 100),
          );
          pollStreamData.voted = true;
          allStreamData[streamDataIndex] = pollStreamData;
          return {
            ...state,
            stream: allStreamData,
          };
        });
      }
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
    case EventsState.UPDATE_TASK:
      let updateTaskStream = state.stream;
      const updateTaskIndex = state.stream.findIndex(
        (item) => item.conversationId === action.data.conversationId,
      );
      updateTaskStream[updateTaskIndex]['tasks'] = [action.data];
      let updateTaskCurrentTask = setCurrentCard(
        state.currentCard,
        updateTaskStream,
      );
      return {
        ...state,
        stream: updateTaskStream,
        currentCard: updateTaskCurrentTask,
        currentTask: updateTaskCurrentTask['tasks'],
      };
    case EventsState.REMOVE_TASK:
      let deleteTaskStream = state.stream;
      const deleteTaskIndex = state.stream.findIndex(
        (item) => item.conversationId === action.data.conversationId,
      );
      deleteTaskStream[deleteTaskIndex]['tasks'] = [];
      let deleteTaskCurrentTask = setCurrentCard(
        state.currentCard,
        deleteTaskStream,
      );
      return {
        ...state,
        stream: deleteTaskStream,
        currentCard: deleteTaskCurrentTask,
        currentTask: deleteTaskCurrentTask['tasks'],
      };
    case EventsState.SOCKET_NOTIFICATION_COUNTS:
      console.log(action, 'notification action');
      let getNotifications = state.notification;
      const checkEventExists = state.notification.events[action.data.appId];
      if (action.data.notificationType === 'events') {
        if (checkEventExists === undefined) {
          getNotifications.events[action.data.appId] = {
            taskIds: [action.data],
            new: 1,
            inProgress: 1,
          };
        } else {
          const newCount =
            action.data.notificationName === 'new'
              ? getNotifications.events[action.data.appId].new + 1
              : getNotifications.events[action.data.appId].new;

          const inProgressCount =
            action.data.notificationName === 'inProgress'
              ? getNotifications.events[action.data.appId].inProgress + 1
              : getNotifications.events[action.data.appId].inProgress;

          getNotifications.events[action.data.appId] = {
            taskIds: [
              ...getNotifications.events[action.data.appId].taskIds,
              action.data,
            ],
            new: newCount,
            inProgress: inProgressCount,
          };
        }
      }
      return {
        ...state,
        notification: getNotifications,
      };
    case EventsState.SOCKET_UPDATE_CURRENT_STREAM: {
      let currentCardData_UPDATE_SOCKET_EVENT;
      if (state.currentCard.id === action.data.id) {
        if (
          action.data?.metadata?.action === 'star' ||
          action.data?.metadata?.action === 'unstar'
        ) {
          currentCardData_UPDATE_SOCKET_EVENT = state.currentCard;
          currentCardData_UPDATE_SOCKET_EVENT['star'] =
            action.data.metadata.action === 'star';
        } else {
          currentCardData_UPDATE_SOCKET_EVENT = setCurrentCard(
            state.currentCard,
            [action.data],
          );
        }
      } else {
        currentCardData_UPDATE_SOCKET_EVENT = state.currentCard;
      }
      const getStarStreamIndex = _.findIndex(state.stream, {
        id: action.data.id,
      });
      let getStarOldData = [...state.stream];
      if (getStarStreamIndex >= 0) {
        if (action.data?.metadata?.action) {
          getStarOldData[getStarStreamIndex]['star'] =
            action.data.metadata.action === 'star';
        } else {
          getStarOldData[getStarStreamIndex] = action.data;
        }
      }
      return {
        ...state,
        stream: getStarOldData,
        currentCard: currentCardData_UPDATE_SOCKET_EVENT,
      };
    }
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

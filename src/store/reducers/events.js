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
    case EventsState.ADD_NEW_ANNOUNCEMENT:
      return {
        ...state,
        stream: [action.data, ...state.stream],
      };
    case EventsState.GET_STATE_COUNTRY_IP:
      console.log(action.data, 'action ====');
    // return {
    //   ...state,
    //   stream: [action.data, ...state.stream],
    // };
    case EventsState.UPDATE_NAME_CHATMENU:
      const getNameIndex = _.findIndex(state.stream, {
        id: action.data.objectId,
      });
      let getNameOldData = [...state.stream];
      getNameOldData[getNameIndex].author.alias = action.data.data;
      return {
        ...state,
        stream: getNameOldData,
      };
    case EventsState.UPDATE_EMAIL_CHATMENU:
      const getEMailIndex = _.findIndex(state.stream, {
        id: action.data.objectId,
      });
      let getEmailOldData = [...state.stream];
      getEmailOldData[getEMailIndex].author.email = action.data.data.email;
      return {
        ...state,
        stream: getEmailOldData,
      };
    case EventsState.UPDATE_PHONE_CHATMENU:
      const getPhoneIndex = _.findIndex(state.stream, {
        id: action.data.objectId,
      });
      let getPhoneOldData = [...state.stream];
      getPhoneOldData[getPhoneIndex].author.phone = action.data.data.phone;
      return {
        ...state,
        stream: getPhoneOldData,
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
    case EventsState.CLOSE_QUESTION:
      const closeQuestionIndex = _.findIndex(state.stream, {
        id: action.data.id,
      });
      let closeQuestionData = [...state.stream];
      closeQuestionData[closeQuestionIndex] = action.data;
      return {
        ...state,
        stream: closeQuestionData,
      };
    default:
      return state;
  }
};

import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';
import {manageApps} from '../../constants/Default';
import * as _ from 'lodash';

const initialState = {
  user: {},
  community: {},
  events: [],
  selectedEvent: {},
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case AuthState.SET_INIT:
      return {
        ...state,
        initData: action.data,
      };
    case AuthState.SET_USER:
      AsyncStorage.setItem('user', JSON.stringify(action.data));
      return {
        ...state,
        user: action.data,
      };
    case AuthState.SET_COMMUNITY:
      const updateState = {
        community: action.data,
      };
      const eventsData = updateState.community;
      const setEventFilterData = [];
      manageApps.forEach((appName) => {
        if (eventsData[appName]?.length) {
          setEventFilterData.push(...eventsData[appName]);
        }
      });
      if (setEventFilterData && setEventFilterData.length) {
        updateState.events = setEventFilterData;
        if (!state.selectedEvent?.id) {
          updateState.selectedEvent = setEventFilterData[0];
        }
      }
      return {
        ...state,
        ...updateState,
      };
    case AuthState.SET_EVENTS:
      console.log(action, 'actions ....');
      return {
        ...state,
        events: action.data,
      };
    case AuthState.SET_SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: action.data,
      };
    case AuthState.CLEAR_USER:
      AsyncStorage.clear();
      return {
        ...state,
        ...initialState,
      };
    case AuthState.UPDATE_EVENTS:
      const eventIndex = _.findIndex(state.events, {id: action.data.id});
      let updateEvent = [...state.events];
      updateEvent[eventIndex] = action.data;
      return {
        ...state,
        events: updateEvent,
      };
    case AuthState.UPDATE_USER_STATUS:
      const communityVar = state.community;
      communityVar.account.status = action.data.status;
      return {
        ...state,
        community: communityVar,
      };
    case AuthState.UPDATE_USER_DETAILS:
      let userData = state.community;
      if (userData.account.id === action.data.id) {
        userData.account = action.data;
      }
      return {
        ...state,
        community: userData,
      };
    case AuthState.UPDATE_CANNED_MESSAGE:
      const getCannedMessage =
        state.community.cannedMessages[`${action.data.cannedMessage.command}`];

      if (getCannedMessage !== undefined) {
        state.community.cannedMessages[
          `${action.data.cannedMessage.command}`
        ] = [...getCannedMessage, action.data.cannedMessage];
      } else {
        state.community.cannedMessages = {
          ...state.community.cannedMessages,
          [action.data.cannedMessage.command]: [action.data.cannedMessage],
        };
      }

      return {
        ...state,
      };
    case AuthState.REMOVE_CANNED_MESSAGE:
      let stateCannedMessage = state.community;
      _.forIn(state.community.cannedMessages, function (value, key) {
        const closeStreamData = _.remove(value, function (val) {
          return val.id !== action.data.cannedMessageId;
        });

        if (closeStreamData.length === 0) {
          delete stateCannedMessage.cannedMessages[`${key}`];
        } else {
          stateCannedMessage.cannedMessages[`${key}`] = closeStreamData;
        }
      });

      return {
        ...state,
        community: stateCannedMessage,
      };
    case AuthState.UPDATE_PIN:
      let updatePinSelectedEvent = state.selectedEvent;
      updatePinSelectedEvent.pinnedPosts = action.data.postId;
      let pinnedIndex = state.events.findIndex(
        (item) => item.id === action.data.post.appId,
      );
      let pinnedEvents = state.events;
      pinnedEvents[pinnedIndex].pinnedPosts = action.data.postId;
      return {
        ...state,
        selectedEvent: updatePinSelectedEvent,
        events: pinnedEvents,
      };
    case AuthState.REMOVE_PIN:
      let unpinSelectedEvent = state.stream;
      unpinSelectedEvent.pinnedPosts = action.data.postId;
      let unpinIndex = state.events.findIndex(
        (item) => item.id === action.data.post.appId,
      );
      let unpinEvents = state.events;
      unpinEvents[unpinIndex].pinnedPosts = action.data.postId;
      unpinSelectedEvent.pinnedPosts = null;
      return {
        ...state,
        selectedEvent: unpinSelectedEvent,
      };
    default:
      return state;
  }
};

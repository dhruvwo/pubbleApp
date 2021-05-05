import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';
import {manageApps} from '../../constants/Default';
import * as _ from 'lodash';

const initialState = {
  user: {},
  community: {},
  events: [],
  selectedEventIndex: 21333,
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
      const setEventFilterData = {};
      manageApps.forEach((appName) => {
        if (eventsData[appName]?.length) {
          eventsData[appName].forEach((evt) => {
            setEventFilterData[evt.id] = evt;
          });
          // setEventFilterData.push(...eventsData[appName]);
        }
      });
      if (setEventFilterData) {
        updateState.events = setEventFilterData;
      }
      return {
        ...state,
        ...updateState,
      };
    case AuthState.SET_EVENTS:
      return {
        ...state,
        events: action.data,
      };
    case AuthState.SET_SELECTED_EVENT_INDEX:
      return {
        ...state,
        selectedEventIndex: action.data,
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
      // let updatePinSelectedEvent = state.selectedEvent;
      // if (state.selectedEvent.id === action.data.post.appId) {
      //   updatePinSelectedEvent = [action.data.postId];
      // }
      let pinnedEvents = state.events;
      pinnedEvents[action.data.post.appId].pinnedPosts = [action.data.postId];
      return {
        ...state,
        events: pinnedEvents,
      };
    case AuthState.REMOVE_PIN:
      let unpinEvents = state.events;
      unpinEvents[action.data.post.appId].pinnedPosts = [];
      return {
        ...state,
        events: unpinEvents,
      };
    case AuthState.SOCKET_NEW_SUBSCRIBER:
      let updateSubscriberEvent = state.events;
      if (updateSubscriberEvent[action.data.eventIndex].subscribers === null) {
        updateSubscriberEvent[action.data.eventIndex].subscribers = [
          action.data.subscriber.account.id,
        ];
      } else if (
        !updateSubscriberEvent[action.data.eventIndex].subscribers.includes(
          action.data.subscriber.account.id,
        )
      ) {
        updateSubscriberEvent[action.data.eventIndex].subscribers.push(
          action.data.subscriber.account.id,
        );
      }
      return {
        ...state,
        events: updateSubscriberEvent,
      };
    case AuthState.SOCKET_UPDATE_SUBSCRIBER:
      const getOldEventsData = state.events;
      const eventsSubscriberData = _.remove(
        getOldEventsData[action.data.eventIndex].subscribers,
        function (val) {
          return val !== action.data.accountId;
        },
      );
      getOldEventsData[
        action.data.eventIndex
      ].subscribers = eventsSubscriberData;
      return {
        ...state,
        events: getOldEventsData,
      };
    default:
      return state;
  }
};

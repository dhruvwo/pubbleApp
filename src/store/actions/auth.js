import {auth} from '../../services/api';
import {AuthState} from '../../constants/GlobalState';
import AsyncStorage from '@react-native-community/async-storage';
import {navigate} from '../../navigation/RootNavigation';
import {collectionsAction} from './collections';
import {manageApps} from '../../constants/Default';
import * as _ from 'lodash';

const setUser = (data) => ({
  type: AuthState.SET_USER,
  data,
});

const setCommunity = (data) => ({
  type: AuthState.SET_COMMUNITY,
  data,
});

const setSelectedEvent = (data) => ({
  type: AuthState.SET_SELECTED_EVENT,
  data,
});

const clearUser = () => ({
  type: AuthState.CLEAR_USER,
});

const updateUserStatus = (data) => ({
  type: AuthState.UPDATE_USER_STATUS,
  data,
});

const updateCannedMessage = (data) => ({
  type: AuthState.UPDATE_CANNED_MESSAGE,
  data,
});

const removeCannedMessage = (data) => ({
  type: AuthState.REMOVE_CANNED_MESSAGE,
  data,
});

const addNewEventsSocket = (data) => ({
  type: AuthState.SET_EVENTS,
  data,
});

const updateEventsSocket = (data) => ({
  type: AuthState.UPDATE_EVENTS,
  data,
});

const updateUserDetails = (data) => ({
  type: AuthState.UPDATE_USER_DETAILS,
  data,
});

const fnPin = (data) => ({
  type: AuthState.UPDATE_PIN,
  data,
});

const fnUnpin = (data) => ({
  type: AuthState.REMOVE_PIN,
  data,
});

const socketNewSubscriber = (data) => ({
  type: AuthState.SOCKET_NEW_SUBSCRIBER,
  data,
});

const login = (loginData) => {
  return (dispatch) => {
    return auth
      .login(loginData)
      .then((response) => {
        if (response.code === 200) {
          const finalRes = {
            accountId: response.accountId,
            data: response.data,
          };
          dispatch(setUser(finalRes));
        }
        return response;
      })
      .catch((err) => {
        console.error('error in login action', err);
        return err.response;
      });
  };
};

const getCommunityData = (shortName) => {
  return (dispatch) => {
    return auth
      .getCommunityData(shortName)
      .then(async (response) => {
        if (response.code === 200 && response.data) {
          dispatch(setCommunity(response.data));
          const groups = {};
          if (response.data.groupApps) {
            response.data.groupApps.forEach((group) => {
              groups[group.id] = group;
            });
            dispatch(collectionsAction.setGroupCollections(groups));
          }
          let accountIds = [];
          manageApps.forEach((appName) => {
            if (response.data[appName] && response.data[appName].length) {
              response.data[appName].forEach((item) => {
                groups[item.id] = item;
                if (item.moderators?.length) {
                  item.moderators.forEach((id) => {
                    if (!accountIds.includes(id)) {
                      accountIds.push(id);
                    }
                  });
                }
                if (item.subscribers?.length) {
                  item.subscribers.forEach((id) => {
                    if (!accountIds.includes(id)) {
                      accountIds.push(id);
                    }
                  });
                }
              });
            }
          });
          dispatch(
            collectionsAction.getDirectoryData({
              accountIds,
              communityId: response.data.community.id,
            }),
          );
        }
        return response;
      })
      .catch((err) => {
        console.error('error in init api after login action', err);
        return err.response;
      });
  };
};

const logout = () => {
  return (dispatch) => {
    dispatch(clearUser());
    AsyncStorage.clear();
    navigate('Login', {
      reset: true,
    });
    return true;
  };
};

export const authAction = {
  setUser,
  login,
  getCommunityData,
  setSelectedEvent,
  logout,
  updateUserStatus,
  updateCannedMessage,
  removeCannedMessage,
  updateUserDetails,
  addNewEventsSocket,
  updateEventsSocket,
  fnPin,
  fnUnpin,
  socketNewSubscriber,
};

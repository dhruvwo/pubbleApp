import {CollectionsState} from '../../constants/GlobalState';
import * as _ from 'lodash';
import md5 from 'md5';

const initialState = {
  users: {},
  groups: {},
};

export const collections = (state = initialState, action) => {
  switch (action.type) {
    case CollectionsState.SET_INIT:
      return {
        ...state,
        initData: action.data,
      };
    case CollectionsState.SET_USER_COLLECTION:
      let users = state.users;
      if (_.isEmpty(users)) {
        users = action.data;
      } else {
        _.forIn(users, (user, key) => {
          users[key] = user;
        });
      }
      return {
        ...state,
        users,
      };
    case CollectionsState.SET_GROUP_COLLECTION:
      let groups = state.groups;
      if (_.isEmpty(groups)) {
        groups = action.data;
      } else {
        _.forIn(groups, (group, key) => {
          groups[key] = group;
        });
      }
      return {
        ...state,
        groups,
      };
    case CollectionsState.UPDATE_USER_COLLECTION_STATUS:
      const getSpecificUser = state.users[action.data.accountId];
      getSpecificUser.status = action.data.status;
      return {
        ...state,
        users: {...state.users, getSpecificUser},
      };
    case CollectionsState.UPDATE_USER_COLLECTION_AVATOR:
      const getSpecificUserAvatar = state.users[action.data.id];
      getSpecificUserAvatar.alias = action.data.alias;
      getSpecificUserAvatar.email = action.data.email;
      getSpecificUserAvatar.avatar = action.data.avatar;
      return {
        ...state,
        users: {...state.users, getSpecificUserAvatar},
      };
    case CollectionsState.SOCKET_USER_OFFLINE_STATUS:
      let getAllUsers = state.users;
      if (action.data.type === 'newConnection') {
        _.forIn(getAllUsers, (user, key) => {
          let getActionMembersList = action.data.members;
          let convertUserIDToMD5 = md5(key.toString());

          if (getActionMembersList[convertUserIDToMD5] !== undefined) {
            getAllUsers[key].status = 'active';
          } else {
            getAllUsers[key].status = 'offline';
          }
        });
      } else {
        _.forIn(getAllUsers, (user, key) => {
          let getActionMembersList = action.data.id;
          let convertUserIDToMD5 = md5(key.toString());

          if (getActionMembersList === convertUserIDToMD5) {
            if (action.data.type === 'memberAdded') {
              getAllUsers[key].status = 'active';
            } else {
              getAllUsers[key].status = 'offline';
            }
          }
        });
      }
      return {
        ...state,
        users: getAllUsers,
      };
    case CollectionsState.SOCKET_NEW_SUBSCRIBER:
      console.log(action, 'collections');
      let updateSubscriber = state.groups;
      if (
        updateSubscriber[action.data.subscriber.targetId].subscribers === null
      ) {
        updateSubscriber[action.data.subscriber.targetId].subscribers = [
          action.data.subscriber.account.id,
        ];
      } else if (
        !updateSubscriber[action.data.subscriber.targetId].subscribers.includes(
          action.data.subscriber.account.id,
        )
      ) {
        updateSubscriber[action.data.subscriber.targetId].subscribers.push(
          action.data.subscriber.account.id,
        );
      }
      console.log(updateSubscriber);
      return {
        ...state,
        groups: updateSubscriber,
      };
    default:
      return state;
  }
};

import {CollectionsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

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
    default:
      return state;
  }
};

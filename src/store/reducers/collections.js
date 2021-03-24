import {CollectionsState} from '../../constants/GlobalState';

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
      return {
        ...state,
        users: action.data,
      };
    case CollectionsState.SET_GROUP_COLLECTION:
      return {
        ...state,
        groups: action.data,
      };
    case CollectionsState.UPDATE_COLLECTION:
      return {
        ...state,
        users: action.data,
      };
    default:
      return state;
  }
};

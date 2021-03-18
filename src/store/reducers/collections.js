import {CollectionsState} from '../../constants/GlobalState';

const initialState = {
  users: [],
};

export const collections = (state = initialState, action) => {
  switch (action.type) {
    case CollectionsState.SET_INIT:
      return {
        ...state,
        initData: action.data,
      };
    case CollectionsState.SET_COLLECTION:
      return {
        ...state,
        users: action.data,
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

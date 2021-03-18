import {EventsState} from '../../constants/GlobalState';

const initialState = {
  stream: [],
};

export const events = (state = initialState, action) => {
  switch (action.type) {
    case EventsState.SET_STREAM:
      return {
        ...state,
        stream: action.data.data,
        totalStream: action.data.total,
      };
    default:
      return state;
  }
};

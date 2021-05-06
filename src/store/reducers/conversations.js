import {ConversationsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  chat: [],
  internal: [],
  eventChat: [],
  currentConversationId: null,
};

export const conversations = (state = initialState, action) => {
  switch (action.type) {
    case ConversationsState.SET_CURRENT_CONVERSATION_ID:
      return {
        ...state,
        currentConversationId: action.data.conversationId,
      };
    case ConversationsState.REMOVE_CURRENT_CONVERSATION_ID:
      return {
        ...state,
        currentConversationId: null,
      };
    case ConversationsState.SET_CONVERSATION:
      let newChat = action.data.data;
      if (action.data.currentPage > 1) {
        newChat = _.uniqBy([...state[action.data.chatType], ...newChat], 'id');
      }
      return {
        ...state,
        [action.data.chatType]: newChat,
      };
    case ConversationsState.UPDATE_CONVERSATION:
      let newChat1 = _.uniqBy(
        [...state[action.data.chatType], ...action.data.data],
        'id',
      );
      return {
        ...state,
        [action.data.chatType]: newChat1,
      };
    case ConversationsState.APPEND_CONVERSATION:
      const appendData = action.data;
      if (appendData.attachments) {
        delete appendData.attachments;
      }
      state[action.data.chatType].unshift(appendData);
      return {
        ...state,
      };
    case ConversationsState.UPDATE_CONVERSATION_BY_ID:
      let chat = state[action.data.chatType];
      if (action.data.id && chat.length) {
        const index = chat.findIndex((o) => o.id === action.data.id);
        if (index > -1) {
          chat[index] = {...chat[index], ...action.data};
        }
      }
      return {
        ...state,
        [action.data.chatType]: chat,
      };
    case ConversationsState.UPDATE_CONVERSATION_BY_TEMP_ID:
      let chatNew3 = state[action.data.chatType];
      if (action.data.tempId && chatNew3.length) {
        const index = chatNew3.findIndex(
          (o) => o.tempId === action.data.tempId,
        );
        if (index > -1) {
          const updatedData = {...chatNew3[index], ...action.data.data};

          if (updatedData.tempId) {
            delete updatedData.tempId;
          }
          chatNew3[index] = updatedData;
        }
      }
      return {
        ...state,
        [action.data.chatType]: chatNew3,
      };
    case ConversationsState.DELETE_CONVERSATION_BY_ID:
      let chatNew4 = state[action.data.chatType];

      if (chatNew4.length && action.data.postId) {
        const index = chatNew4.findIndex((o) => {
          return action.data.postId === o.id;
        });
        if (index > -1) {
          let conversationClone = _.clone(chatNew4);
          conversationClone.splice(index, 1);
          chatNew4 = conversationClone;
        }
      }
      return {
        ...state,
        [action.data.chatType]: chatNew4,
      };
    default:
      return state;
  }
};

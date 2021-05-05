import {ConversationsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const initialState = {
  chat: [],
  internal: [],
  eventChat: [],
};

export const conversations = (state = initialState, action) => {
  switch (action.type) {
    case ConversationsState.SET_CONVERSATION:
      let newChat = action.data.data;
      if (action.data.currentPage > 1) {
        newChat = _.uniqBy([...state.chat, ...newChat], 'id');
      }
      return {
        ...state,
        chat: newChat,
      };
    case ConversationsState.UPDATE_CONVERSATION:
      let newChat1 = _.uniqBy([...state.chat, ...action.data.data], 'id');
      return {
        ...state,
        chat: newChat1,
      };
    case ConversationsState.APPEND_CONVERSATION:
      const appendData = action.data;
      if (appendData.attachments) {
        delete appendData.attachments;
      }
      state.chat.unshift(appendData);
      return {
        ...state,
      };
    case ConversationsState.UPDATE_CONVERSATION_BY_ID:
      let chat = state.chat;
      if (action.data.id && chat.length) {
        const index = chat.findIndex((o) => o.id === action.data.id);
        if (index > -1) {
          chat[index] = {...chat[index], ...action.data};
        }
      }
      return {
        ...state,
        chat,
      };
    case ConversationsState.UPDATE_CONVERSATION_BY_TEMP_ID:
      let chatNew3 = state.chat;
      if (action.data.tempId && chatNew3.length) {
        const index = chatNew3.findIndex(
          (o) => o.tempId === action.data.tempId,
        );
        if (index > -1) {
          const updatedData = {...chatNew3[index], ...action.data.data};

          if (updatedData.tempId) {
            delete updatedData.tempId;
          }
          console.log('updatedData', updatedData);
          chatNew3[index] = updatedData;
        }
      }
      return {
        ...state,
        chat: chatNew3,
      };
    case ConversationsState.DELETE_CONVERSATION_BY_ID:
      let chatNew4 = state.chat;

      if (chatNew4.length && action.data) {
        const index = chatNew4.findIndex((o) => {
          return action.data === o.id;
        });
        if (index > -1) {
          let conversationClone = _.clone(chatNew4);
          conversationClone.splice(index, 1);
          chatNew4 = conversationClone;
        }
      }
      return {
        ...state,
        chat: chatNew4,
      };

    // internal
    case ConversationsState.SET_INTERNAL_CONVERSATION:
      let newInternalChat = action.data.data;
      if (action.data.currentPage > 1) {
        newInternalChat = _.uniqBy([...state.internal, ...newChat], 'id');
      }
      return {
        ...state,
        internal: newInternalChat,
      };
    case ConversationsState.UPDATE_INTERNAL_CONVERSATION:
      let newInternalChat1 = _.uniqBy(
        [...state.internal, ...action.data.data],
        'id',
      );
      return {
        ...state,
        chat: newInternalChat1,
      };
    case ConversationsState.APPEND_INTERNAL_CONVERSATION:
      const appendData1 = action.data;
      if (appendData1.attachments) {
        delete appendData1.attachments;
      }
      state.internal.unshift(appendData1);
      return {
        ...state,
      };
    case ConversationsState.UPDATE_INTERNAL_CONVERSATION_BY_ID:
      let internal = state.internal;
      if (action.data.id && internal.length) {
        const index = internal.findIndex((o) => o.id === action.data.id);
        if (index > -1) {
          internal[index] = {...internal[index], ...action.data};
        }
      }
      return {
        ...state,
        internal,
      };
    case ConversationsState.UPDATE_INTERNAL_CONVERSATION_BY_TEMP_ID:
      let chatInternalNew3 = state.internal;
      if (action.data.tempId && chatInternalNew3.length) {
        const index = chatInternalNew3.findIndex(
          (o) => o.tempId === action.data.tempId,
        );
        if (index > -1) {
          const updatedData = {...chatInternalNew3[index], ...action.data.data};

          if (updatedData.tempId) {
            delete updatedData.tempId;
          }
          chatInternalNew3[index] = updatedData;
        }
      }
      return {
        ...state,
        internal: chatInternalNew3,
      };
    case ConversationsState.DELETE_INTERNAL_CONVERSATION_BY_ID:
      let chatInternalNew4 = state.internal;
      if (chatInternalNew4.length && action.data) {
        const index = chatInternalNew4.findIndex((o) => {
          return action.data === o.id;
        });
        if (index > -1) {
          let conversationClone = _.clone(chatInternalNew4);
          conversationClone.splice(index, 1);
          chatInternalNew4 = conversationClone;
        }
      }
      return {
        ...state,
        internal: chatInternalNew4,
      };

    //eventChat
    case ConversationsState.SET_EVENT_CONVERSATION:
      let newEventChat = action.data.data;
      if (action.data.currentPage > 1) {
        newEventChat = _.uniqBy([...state.eventChat, ...newChat], 'id');
      }
      return {
        ...state,
        eventChat: newEventChat,
      };
    case ConversationsState.APPEND_EVENT_CONVERSATION:
      state.eventChat.unshift(action.data);
      return {
        ...state,
      };
    case ConversationsState.UPDATE_EVENT_CONVERSATION_BY_ID:
      let eventChat = state.eventChat;
      if (action.data.id && eventChat.length) {
        const index = eventChat.findIndex((o) => o.id === action.data.id);
        if (index > -1) {
          eventChat[index] = {...eventChat[index], ...action.data};
        }
      }
      return {
        ...state,
        eventChat,
      };
    case ConversationsState.DELETE_EVENT_CONVERSATION_BY_ID:
      let newEventChat1 = state.eventChat;
      if (newEventChat1.length && action.data) {
        const index = newEventChat1.findIndex((o) => {
          return action.data === o.id;
        });
        if (index > -1) {
          let conversationClone = _.clone(newEventChat1);
          conversationClone.splice(index, 1);
          newEventChat1 = conversationClone;
        }
      }
      return {
        ...state,
        eventChat: newEventChat1,
      };
    default:
      return state;
  }
};

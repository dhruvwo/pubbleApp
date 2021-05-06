import {ConversationsState} from '../../constants/GlobalState';

const setCurrentConversationId = (data) => ({
  type: ConversationsState.SET_CURRENT_CONVERSATION_ID,
  data,
});

const removeCurrentConversationId = (data) => ({
  type: ConversationsState.REMOVE_CURRENT_CONVERSATION_ID,
  data,
});

const setConversation = (data) => ({
  type: ConversationsState.SET_CONVERSATION,
  data,
});

const updateConversations = (data) => ({
  type: ConversationsState.UPDATE_CONVERSATION,
  data,
});

const appendConversations = (data) => ({
  type: ConversationsState.APPEND_CONVERSATION,
  data,
});

const updateConversationByTempId = (data) => ({
  type: ConversationsState.UPDATE_CONVERSATION_BY_TEMP_ID,
  data,
});

const updateConversationById = (data) => ({
  type: ConversationsState.UPDATE_CONVERSATION_BY_ID,
  data,
});

const deleteConversationById = (data) => ({
  type: ConversationsState.DELETE_CONVERSATION_BY_ID,
  data,
});

export const conversationsAction = {
  setCurrentConversationId,
  removeCurrentConversationId,
  setConversation,
  updateConversations,
  appendConversations,
  updateConversationById,
  updateConversationByTempId,
  deleteConversationById,
};

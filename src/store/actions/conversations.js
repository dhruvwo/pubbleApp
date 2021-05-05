import {ConversationsState} from '../../constants/GlobalState';

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

// for internal chat

const setInternalConversation = (data) => ({
  type: ConversationsState.SET_INTERNAL_CONVERSATION,
  data,
});

const updateInternalConversations = (data) => ({
  type: ConversationsState.UPDATE_INTERNAL_CONVERSATION,
  data,
});

const appendInternalConversations = (data) => ({
  type: ConversationsState.APPEND_INTERNAL_CONVERSATION,
  data,
});

const updateInternalConversationByTempId = (data) => ({
  type: ConversationsState.UPDATE_INTERNAL_CONVERSATION_BY_TEMP_ID,
  data,
});

const updateInternalConversationById = (data) => ({
  type: ConversationsState.UPDATE_INTERNAL_CONVERSATION_BY_ID,
  data,
});

const deleteInternalConversationById = (data) => ({
  type: ConversationsState.DELETE_INTERNAL_CONVERSATION_BY_ID,
  data,
});

// for event chat

const setEventConversation = (data) => ({
  type: ConversationsState.SET_EVENT_CONVERSATION,
  data,
});

const appendEventConversations = (data) => ({
  type: ConversationsState.APPEND_EVENT_CONVERSATION,
  data,
});

const updateEventConversationById = (data) => ({
  type: ConversationsState.UPDATE_EVENT_CONVERSATION_BY_ID,
  data,
});

const deleteEventConversationById = (data) => ({
  type: ConversationsState.DELETE_EVENT_CONVERSATION_BY_ID,
  data,
});

export const conversationsAction = {
  setConversation,
  updateConversations,
  appendConversations,
  updateConversationById,
  updateConversationByTempId,
  deleteConversationById,
  setInternalConversation,
  updateInternalConversations,
  appendInternalConversations,
  updateInternalConversationById,
  updateInternalConversationByTempId,
  deleteInternalConversationById,
  setEventConversation,
  appendEventConversations,
  updateEventConversationById,
  deleteEventConversationById,
};

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

const setAnotherPersonTyping = (data) => ({
  type: ConversationsState.SET_ANOTHER_PERSON_TYPING,
  data,
});

const removeAnotherPersonTyping = () => ({
  type: ConversationsState.REMOVE_ANOTHER_PERSON_TYPING,
});

export const conversationsAction = {
  setConversation,
  updateConversations,
  appendConversations,
  updateConversationById,
  updateConversationByTempId,
  deleteConversationById,
  setAnotherPersonTyping,
  removeAnotherPersonTyping,
};

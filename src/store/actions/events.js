import {EventsState} from '../../constants/GlobalState';
import {events} from '../../services/api';

const setStream = (data) => ({
  type: EventsState.SET_STREAM,
  data,
});

const setInboxStream = (data) => ({
  type: EventsState.SET_INBOX_STREAM,
  data,
});

const updateStream = (data) => ({
  type: EventsState.UPDATE_STREAM,
  data,
});

const deleteStream = (data) => ({
  type: EventsState.DELETE_STREAM,
  data,
});

const starStream = (data) => ({
  type: EventsState.STAR_STREAM,
  data,
});

const closeStream = (data) => ({
  type: EventsState.CLOSE_STREAM,
  data,
});

const updateAssigne = (data) => ({
  type: EventsState.UPDATE_ASSIGN,
  data,
});

const unAssign = (data) => ({
  type: EventsState.REMOVE_ASSIGN,
  data,
});

const addNewAnnouncement = (data) => ({
  type: EventsState.ADD_NEW_ANNOUNCEMENT,
  data,
});

const getStateCountryFromIPState = (data) => ({
  type: EventsState.GET_STATE_COUNTRY_IP,
  data,
});

const updateStreamAuthorData = (data) => ({
  type: EventsState.UPDATE_STREAM_AUTHOR_DATA,
  data,
});

const addTags = (data) => ({
  type: EventsState.ADD_NEW_TAGS,
  data,
});

const selectedTagFilterOption = (data) => ({
  type: EventsState.SELECTED_TAG_OPTION,
  data,
});

const setFilterParams = (data) => ({
  type: EventsState.FILTER_PARAMS,
  data,
});

const updateAssigneData = (params) => {
  return (dispatch) => {
    return events
      .updateAssigneData(params)
      .then((response) => {
        dispatch(updateAssigne(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateAssigneData action', err);
        return err.response;
      });
  };
};

const removeAssignee = (params) => {
  return (dispatch) => {
    return events
      .removeAssignee(params)
      .then((response) => {
        dispatch(unAssign(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in removeAssignee action', err);
        return err.response;
      });
  };
};

const getStreamData = (params, type) => {
  return (dispatch) => {
    return events
      .getStreamData(params)
      .then((response) => {
        if (type === 'inbox') {
          dispatch(setInboxStream(response.data));
        } else {
          dispatch(setStream(response.data));
        }
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const replyingPost = (params) => {
  return (dispatch) => {
    return events
      .replyingPost(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in replyingPost action', err);
        return err.response;
      });
  };
};

const getCountsData = (params) => {
  return (dispatch) => {
    return events
      .getCountsData(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in getCountsData action', err);
        return err.response;
      });
  };
};

const lockStream = (params, type) => {
  return (dispatch) => {
    return events
      .lockStream(params, type)
      .then((response) => {
        dispatch(updateStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateStar action', err);
        return err.response;
      });
  };
};

const updateStar = (params, type, reducerParam) => {
  return (dispatch) => {
    return events
      .updateStar(params, type)
      .then((response) => {
        dispatch(starStream(reducerParam));
        return response.data;
      })
      .catch((err) => {
        console.error('error in updateStar action', err);
        return err.response;
      });
  };
};

const approveDisapproveStreamData = (params, UrlSlug) => {
  return (dispatch) => {
    return events
      .approveDisapproveStreamData(params, UrlSlug)
      .then((response) => {
        dispatch(updateStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const deleteStreamData = (params) => {
  return (dispatch) => {
    return events
      .deleteStreamData(params)
      .then((response) => {
        dispatch(deleteStream(params));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const closeStreamData = (params) => {
  return (dispatch) => {
    return events
      .closeStreamData(params)
      .then((response) => {
        dispatch(closeStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const closePollVotingAction = (params) => {
  return (dispatch) => {
    return events
      .closePollVotingAction(params)
      .then((response) => {
        dispatch(updateStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const votingAction = (params) => {
  return (dispatch) => {
    return events
      .votingAction(params)
      .then((response) => {
        // dispatch(voting(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStreamData action', err);
        return err.response;
      });
  };
};

const pinToTop = (params) => {
  return (dispatch) => {
    return events
      .pinToTop(params)
      .then((response) => {
        // dispatch(voting(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in pinToTop action', err);
        return err.response;
      });
  };
};

const getConversation = (params) => {
  return (dispatch) => {
    return events
      .getConversation(params)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error('error in getConversation action', err);
        return err.response;
      });
  };
};

const postReply = (params) => {
  return (dispatch) => {
    return events
      .postReply(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in postReply action', err);
        return err.response;
      });
  };
};

const markasTop = (params) => {
  return (dispatch) => {
    return events
      .markasTop(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in markasTop action', err);
        return err.response;
      });
  };
};

const approveUnApprovePost = (params, type) => {
  return (dispatch) => {
    return events
      .approveUnApprovePost(params, type)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in approveUnApprovePost action', err);
        return err.response;
      });
  };
};

const deleteItem = (params, type) => {
  return (dispatch) => {
    return events
      .deleteItem(params, type)
      .then((response) => {
        return true;
      })
      .catch((err) => {
        console.error('error in deleteItem action', err);
        return err.response;
      });
  };
};

const banVisitor = (params, type) => {
  return (dispatch) => {
    return events
      .banVisitor(params, type)
      .then((response) => {
        return true;
      })
      .catch((err) => {
        console.error('error in banVisitor action', err);
        return err.response;
      });
  };
};

const changeVisibility = (params, type) => {
  return (dispatch) => {
    return events
      .changeVisibility(params, type)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in changeVisibility action', err);
        return err.response;
      });
  };
};
const editPost = (params, type) => {
  return (dispatch) => {
    return events
      .editPost(params, type)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in editPost action', err);
        return err.response;
      });
  };
};
const addNewAnnouncementFunc = (params, type) => {
  return (dispatch) => {
    return events
      .addNewAnnouncementFunc(params, type)
      .then((response) => {
        if (type === 'announcement') {
          dispatch(addNewAnnouncement(response.data));
        }
        return response.data;
      })
      .catch((err) => {
        console.error('error in addNewAnnouncementFunc action', err);
        return err.response;
      });
  };
};

const getStateCountryFromIPFuc = (params) => {
  return (dispatch) => {
    return events
      .getStateCountryFromIPFuc(params)
      .then((response) => {
        // dispatch(getStateCountryFromIPState(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in getStateCountryFromIPFuc action', err);
        return err.response;
      });
  };
};

const editHandlerChatMenuFunc = (params, type) => {
  return (dispatch) => {
    return events
      .editHandlerChatMenuFunc(params, type)
      .then((response) => {
        console.log(response, 'respose =====');
        dispatch(
          updateStreamAuthorData({
            id: response.objectId,
            data: {
              [type]: params[type],
            },
          }),
        );
        return response.data;
      })
      .catch((err) => {
        console.error('error in editHandlerChatMenuFunc action', err);
        return err.response;
      });
  };
};

const sendEmailNotificationFunc = (params) => {
  return (dispatch) => {
    return events
      .sendEmailNotificationFunc(params)
      .then((response) => {
        // dispatch(addNewAnnouncement(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in sendEmailNotificationFunc action', err);
        return err.response;
      });
  };
};

const addTagsFunc = (params) => {
  return (dispatch) => {
    return events
      .addTagsFunc(params)
      .then((response) => {
        dispatch(addTags(response));
        return response.data;
      })
      .catch((err) => {
        console.error('error in addTagsFunc action', err);
        return err.response;
      });
  };
};

const deleteTagsFunc = (params) => {
  return (dispatch) => {
    return events
      .deleteTagsFunc(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in deleteTagsFunc action', err);
        return err.response;
      });
  };
};

const closeQuestionFunc = (params) => {
  return (dispatch) => {
    return events
      .closeQuestionFunc(params)
      .then((response) => {
        dispatch(updateStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in closeQuestionFunc action', err);
        return err.response;
      });
  };
};

const tranlationOptionFunc = (params) => {
  return (dispatch) => {
    return events
      .tranlationOptionFunc(params)
      .then((response) => {
        dispatch(updateStream(response.data));
        return response.data;
      })
      .catch((err) => {
        console.error('error in tranlationOptionFunc action', err);
        return err.response;
      });
  };
};

const getFaqDataFunc = (params) => {
  return (dispatch) => {
    return events
      .getFaqDataFunc(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in editPost action', err);
        return err.response;
      });
  };
};

const chatmenuStreamVisitor = (params) => {
  return (dispatch) => {
    return events
      .chatmenuStreamVisitor(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in chatmenuStreamVisitor action', err);
        return err.response;
      });
  };
};

const eventDetailTagFilter = (params) => {
  return (dispatch) => {
    return events
      .eventDetailTagFilter(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in eventDetailTagFilter action', err);
        return err.response;
      });
  };
};

export const eventsAction = {
  getStreamData,
  approveDisapproveStreamData,
  deleteStreamData,
  lockStream,
  getCountsData,
  updateStar,
  closeStreamData,
  removeAssignee,
  closePollVotingAction,
  updateAssigneData,
  votingAction,
  pinToTop,
  getConversation,
  postReply,
  replyingPost,
  markasTop,
  approveUnApprovePost,
  deleteItem,
  banVisitor,
  changeVisibility,
  editPost,
  addNewAnnouncementFunc,
  getStateCountryFromIPFuc,
  editHandlerChatMenuFunc,
  sendEmailNotificationFunc,
  addTagsFunc,
  deleteTagsFunc,
  closeQuestionFunc,
  tranlationOptionFunc,
  getFaqDataFunc,
  chatmenuStreamVisitor,
  eventDetailTagFilter,
  selectedTagFilterOption,
  setFilterParams,
};

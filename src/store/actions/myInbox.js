import {MyInboxState} from '../../constants/GlobalState';
import {myInbox} from '../../services/api';

const setStream = (data) => ({
  type: MyInboxState.SET_INBOX_STREAM_DATA,
  data,
});

const setInboxStream = (data) => ({
  type: MyInboxState.SET_INBOX_STREAM,
  data,
});

const updateStream = (data) => ({
  type: MyInboxState.UPDATE_INBOX_STREAM,
  data,
});

const deleteStream = (data) => ({
  type: MyInboxState.DELETE_INBOX_STREAM,
  data,
});

const starStream = (data) => ({
  type: MyInboxState.STAR_INBOX_STREAM,
  data,
});

const closeStream = (data) => ({
  type: MyInboxState.CLOSE_INBOX_STREAM,
  data,
});

const updateAssigne = (data) => ({
  type: MyInboxState.UPDATE_INBOX_ASSIGN,
  data,
});

const unAssign = (data) => ({
  type: MyInboxState.REMOVE_INBOX_ASSIGN,
  data,
});

const addNewAnnouncement = (data) => ({
  type: MyInboxState.ADD_NEW_INBOX_ANNOUNCEMENT,
  data,
});

const getStateCountryFromIPState = (data) => ({
  type: MyInboxState.GET_INBOX_STATE_COUNTRY_IP,
  data,
});

const updateStreamAuthorData = (data) => ({
  type: MyInboxState.UPDATE_INBOX_STREAM_AUTHOR_DATA,
  data,
});

const addTags = (data) => ({
  type: MyInboxState.ADD_NEW_INBOX_TAGS,
  data,
});

const setFilterData = (data) => ({
  type: MyInboxState.SET_INBOX_FILTER_DATA,
  data,
});

const clearFilterData = (data) => ({
  type: MyInboxState.CLEAR_INBOX_FILTER_DATA,
  data,
});

const setFilterParams = (data) => ({
  type: MyInboxState.INBOX_FILTER_PARAMS,
  data,
});

const updatePublishPost = (data) => ({
  type: MyInboxState.UPDATE_INBOX_PUBLISH_POST,
  data,
});

const getStreamData = (params, type) => {
  return (dispatch) => {
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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

const postReply = (params) => {
  return (dispatch) => {
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
      .addNewAnnouncementFunc(params, type)
      .then((response) => {
        if (type !== 'internal') {
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
    return myInbox
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
    return myInbox
      .editHandlerChatMenuFunc(params, type)
      .then((response) => {
        if (response.code === 200) {
          let data;
          if (type === 'name') {
            data = {
              [type]: response.data,
            };
          } else {
            data = {
              [type]: response.data[type],
            };
          }
          dispatch(
            updateStreamAuthorData({
              id: response.objectId,
              data,
            }),
          );
        }
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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
    return myInbox
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

const publishPost = (params) => {
  return (dispatch) => {
    return myInbox
      .publishPost(params)
      .then((response) => {
        dispatch(updatePublishPost(response.objectId));
        return response.data;
      })
      .catch((err) => {
        console.error('error in publishPost action', err);
        return err.response;
      });
  };
};

const moveToDraft = (params) => {
  return (dispatch) => {
    return myInbox
      .moveToDraft(params)
      .then((response) => {
        dispatch(updatePublishPost(response.objectId));
        return response.data;
      })
      .catch((err) => {
        console.error('error in moveToDraft action', err);
        return err.response;
      });
  };
};

const moveToTrash = (params) => {
  return (dispatch) => {
    return myInbox
      .moveToTrash(params)
      .then((response) => {
        dispatch(updatePublishPost(response.objectId));
        return response.data;
      })
      .catch((err) => {
        console.error('error in moveToTrash action', err);
        return err.response;
      });
  };
};

const permanentlyDelete = (params) => {
  return (dispatch) => {
    return myInbox
      .permanentlyDelete(params)
      .then((response) => {
        dispatch(updatePublishPost(response.objectId));
        return response.data;
      })
      .catch((err) => {
        console.error('error in permanentlyDelete action', err);
        return err.response;
      });
  };
};

const restorePost = (params) => {
  return (dispatch) => {
    return myInbox
      .restorePost(params)
      .then((response) => {
        dispatch(updatePublishPost(response.objectId));
        return response.data;
      })
      .catch((err) => {
        console.error('error in restorePost action', err);
        return err.response;
      });
  };
};

const pinPost = (params) => {
  return (dispatch) => {
    return myInbox
      .pinPost(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in pinPost action', err);
        return err.response;
      });
  };
};

const unPinPost = (params) => {
  return (dispatch) => {
    return myInbox
      .unPinPost(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in pinPost action', err);
        return err.response;
      });
  };
};

export const myInboxAction = {
  getStreamData,
  approveDisapproveStreamData,
  deleteStreamData,
  lockStream,
  getCountsData,
  updateStar,
  closeStreamData,
  closePollVotingAction,
  votingAction,
  pinToTop,
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
  setFilterData,
  setFilterParams,
  publishPost,
  moveToDraft,
  moveToTrash,
  permanentlyDelete,
  restorePost,
  pinPost,
  unPinPost,
  clearFilterData,
  updateAssigne,
  unAssign,
  updateStream,
  starStream,
};

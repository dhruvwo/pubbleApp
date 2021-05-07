import {API_URL} from '../../../env.json';
import axios from 'axios';
import * as _ from 'lodash';

const getStreamData = async (params) => {
  return axios
    .get(`${API_URL}/dashboard/stream`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const replyingPost = async (params) => {
  return axios
    .get(`${API_URL}/post/replying`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const approveDisapproveStreamData = async (params, UrlSlug) => {
  return axios
    .get(`${API_URL}/post/${UrlSlug}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const deleteStreamData = async (params) => {
  return axios
    .get(`${API_URL}/post/delete`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const getCountsData = async (params) => {
  return axios
    .get(`${API_URL}/app/message/count`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const updateStar = async (params, type) => {
  return axios
    .get(`${API_URL}/post/${type}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const lockStream = async (params, type) => {
  return axios
    .get(`${API_URL}/conversation/${type}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const closeStreamData = async (params) => {
  return axios
    .get(`${API_URL}/post/close`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const updateAssigneData = async (params) => {
  return axios
    .get(`${API_URL}/post/assign`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const closePollVotingAction = async (params) => {
  return axios
    .get(`${API_URL}/post/update/date`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const removeAssignee = async (params) => {
  return axios
    .get(`${API_URL}/post/unassign`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const votingAction = async (params) => {
  return axios
    .get(`${API_URL}/vote`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const pinToTop = async (params) => {
  return axios
    .get(`${API_URL}/post/pin`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const getConversation = async (params) => {
  return axios
    .get(`${API_URL}/dashboard/stream/conversation`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const postReply = async (params) => {
  var bodyFormData = new FormData();

  _.forIn(params, (value, key) => {
    bodyFormData.append(key, value);
  });
  if (params.attachments) {
    return axios
      .request({
        method: 'post',
        url: `${API_URL}/post/reply`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  } else {
    return axios
      .get(`${API_URL}/post/reply`, {
        params,
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
};

const markasTop = async (params) => {
  let url = `${API_URL}/post/top`;
  if (params.isRemove) {
    url = `${url}/remove`;
    delete params.isRemove;
  }
  return axios
    .get(url, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const approveUnApprovePost = async (params, type) => {
  return axios
    .get(`${API_URL}/post/${type}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const deleteItem = async (params) => {
  return axios
    .get(`${API_URL}/post/delete`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const banVisitor = async (params) => {
  return axios
    .get(`${API_URL}/acl/add`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const changeVisibility = async (params) => {
  return axios
    .get(`${API_URL}/post/visibility`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const editPost = async (params) => {
  return axios
    .get(`${API_URL}/post/edit`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const addNewAnnouncementFunc = async (params, type) => {
  var bodyFormData = new FormData();

  _.forIn(params, (value, key) => {
    bodyFormData.append(key, value);
  });
  if (type === 'internal' || type === 'eventChat') {
    return axios
      .request({
        method: 'post',
        url: `${API_URL}/post/new`,
        data: bodyFormData,
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  } else {
    return axios
      .get(`${API_URL}/post/new`, {
        params,
      })
      .then((res) => {
        return Promise.resolve(res.data);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
};

const getStateCountryFromIPFuc = async (params) => {
  return axios
    .post(`https://media.pubble.io/ips`, params)
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const editHandlerChatMenuFunc = async (params, type) => {
  return axios
    .get(`${API_URL}/post/update/${type}`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const sendEmailNotificationFunc = async (params) => {
  return axios
    .get(`${API_URL}/post/seq`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const addTagsFunc = async (params) => {
  return axios
    .get(`${API_URL}/post/tags/add`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const deleteTagsFunc = async (params) => {
  return axios
    .get(`${API_URL}/post/tags/delete`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const closeQuestionFunc = async (params) => {
  return axios
    .get(`${API_URL}/post/close`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const tranlationOptionFunc = async (params) => {
  return axios
    .get(`${API_URL}/post/translate/save`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const getFaqDataFunc = async (params) => {
  return axios
    .get(`${API_URL}/faq/stream`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const chatmenuStreamVisitor = async (params) => {
  return axios
    .get(`${API_URL}/stream/visitor`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const eventDetailTagFilter = async (params) => {
  return axios
    .get(`${API_URL}/dashboard/tag/stream/count`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const publishPost = async (params) => {
  return axios
    .get(`${API_URL}/post/approve`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const moveToDraft = async (params) => {
  return axios
    .get(`${API_URL}/post/unapprove`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const moveToTrash = async (params) => {
  return axios
    .get(`${API_URL}/post/trash`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const permanentlyDelete = async (params) => {
  return axios
    .get(`${API_URL}/post/delete`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const restorePost = async (params) => {
  return axios
    .get(`${API_URL}/post/restore`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const pinPost = async (params) => {
  return axios
    .get(`${API_URL}/post/pin`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const unPinPost = async (params) => {
  return axios
    .get(`${API_URL}/post/unpin`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const updatePoll = async (params) => {
  return axios
    .get(`${API_URL}/post/poll/update`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const addTaskReminder = async (params) => {
  return axios
    .get(`${API_URL}/task/conversation/remind/add`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const deleteTaskReminder = async (params) => {
  return axios
    .get(`${API_URL}/task/conversation/remind/delete`, {
      params,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const events = {
  getStreamData,
  getCountsData,
  approveDisapproveStreamData,
  deleteStreamData,
  lockStream,
  updateStar,
  closeStreamData,
  updateAssigneData,
  removeAssignee,
  closePollVotingAction,
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
  publishPost,
  moveToDraft,
  moveToTrash,
  permanentlyDelete,
  restorePost,
  pinPost,
  unPinPost,
  updatePoll,
  addTaskReminder,
  deleteTaskReminder,
};

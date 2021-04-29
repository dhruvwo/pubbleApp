import {collections} from '../../services/api';
import {CollectionsState} from '../../constants/GlobalState';
import * as _ from 'lodash';

const pageSize = 50;

const setUserCollections = (data) => ({
  type: CollectionsState.SET_USER_COLLECTION,
  data,
});

const setGroupCollections = (data) => ({
  type: CollectionsState.SET_GROUP_COLLECTION,
  data,
});

const updateUserCollectionStatus = (data) => ({
  type: CollectionsState.UPDATE_USER_COLLECTION_STATUS,
  data,
});

const updateUserCollectionAvatar = (data) => ({
  type: CollectionsState.UPDATE_USER_COLLECTION_AVATOR,
  data,
});

const socketUpdateOfflineStatus = (data) => ({
  type: CollectionsState.SOCKET_USER_OFFLINE_STATUS,
  data,
});

const socketAddNewSubscriber = (data) => ({
  type: CollectionsState.SOCKET_NEW_SUBSCRIBER_COLLECTION,
  data,
});

const socketUpdateSubscriber = (data) => ({
  type: CollectionsState.SOCKET_UPDATE_SUBSCRIBER_COLLECTION,
  data,
});

async function getDirectoryDataByAccountIds(params) {
  params.pageSize = pageSize;
  return await collections
    .getDirectoryData(params)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.error('error in getDirectoryDataByAccountIds action', err);
      return err.response;
    });
}

function searchDirectoryData(params) {
  return (dispatch) => {
    return collections
      .getDirectoryData(params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error('error in searchDirectoryData action', err);
        return err.response;
      });
  };
}

const getDirectoryData = (params) => {
  return (dispatch) => {
    const paramName = params.accountIds?.length ? 'accountIds' : 'appIds';
    if (!params[paramName].chunk_inefficient) {
      Object.defineProperty(Array.prototype, 'chunk_inefficient', {
        value: function (chunkSize) {
          var array = this;
          return [].concat.apply(
            [],
            array.map(function (elem, i) {
              return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            }),
          );
        },
      });
    }
    const chunks = params[paramName].chunk_inefficient(pageSize);
    return Promise.all(
      chunks.map(async (accountIds) => {
        const res = await getDirectoryDataByAccountIds({
          ...params,
          [paramName]: accountIds.join(),
        });
        return res.data;
      }),
    )
      .then((chunkedUsers) => {
        const usersObj = {};
        chunkedUsers.forEach((users) => {
          users.forEach((user) => {
            usersObj[user.id] = user;
          });
        });
        if (!_.isEmpty(usersObj)) {
          if (paramName === 'accountIds') {
            dispatch(setUserCollections(usersObj));
          } else if (paramName === 'appIds') {
            dispatch(setGroupCollections(usersObj));
          }
        }
        return usersObj;
      })
      .catch((err) => {
        console.error('error in getDirectoryData action', err);
        return err.response;
      });
  };
};

export const collectionsAction = {
  getDirectoryData,
  setGroupCollections,
  searchDirectoryData,
  updateUserCollectionStatus,
  updateUserCollectionAvatar,
  socketUpdateOfflineStatus,
  socketAddNewSubscriber,
  socketUpdateSubscriber,
};

import {collections} from '../../services/api';
import {CollectionsState} from '../../constants/GlobalState';

const pageSize = 50;

const setCollections = (data) => ({
  type: CollectionsState.SET_COLLECTION,
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

const getDirectoryData = (params) => {
  return (dispatch) => {
    if (!params.accountIds.chunk_inefficient) {
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
    const chunks = params.accountIds.chunk_inefficient(pageSize);
    return Promise.all(
      chunks.map(async (accountIds) => {
        const res = await getDirectoryDataByAccountIds({
          ...params,
          accountIds: accountIds.join(),
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
        dispatch(setCollections(usersObj));
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
};

import {PermissionsAndroid, Platform, Alert} from 'react-native';
import ToastService from './ToastService';
import * as _ from 'lodash';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import axios from 'axios';

export async function downloadFile(fileUrl, callBackBegin, callBackProgress) {
  if (Platform.OS === 'ios') {
    startDownload(fileUrl, callBackBegin, callBackProgress);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'Application needs access to your storage to download File',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        startDownload(fileUrl, callBackBegin, callBackProgress);
      } else {
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      console.log('++++', err);
    }
  }
}

function getFileName(fileUrl) {
  let newFileUrl = _.clone(fileUrl);
  const splitData = newFileUrl.split('/');
  newFileUrl = splitData[splitData.length - 1];
  return newFileUrl;
}

export const checkIfFileExists = async (fileUrl) => {
  let file_Name = getFileName(fileUrl);
  const localFile = `${RNFS.DocumentDirectoryPath}/${file_Name}`;
  const isFileExists = await RNFS.exists(localFile);
  const data = {
    exists: isFileExists,
    filePath: localFile,
  };
  return data;
};

const startDownload = async (fileUrl, callBackBegin, callBackProgress) => {
  let file_Name = getFileName(fileUrl);
  const localFile = `${RNFS.DocumentDirectoryPath}/${file_Name}`;
  const options = {
    fromUrl: fileUrl,
    toFile: localFile,
    begin: (data) => {
      callBackBegin(data);
    },
    progress: (data) => {
      const percentage = Math.floor(
        (data.bytesWritten / data.contentLength) * 100,
      );
      callBackProgress(percentage);
    },
  };
  RNFS.downloadFile(options)
    .promise.then(async () => {
      callBackProgress(null);
      ToastService({
        message: 'File Downloaded Successfully.',
      });
      FileViewer.open(localFile, {
        showAppsSuggestions: true,
        showOpenWithDialog: true,
      });
    })
    .then((res) => {
      console.log('downloadFile res', res);
    })
    .catch((error) => {
      console.log('downloadFile error', error);
    });
};

export async function uploadFile(params, onUploadProgress) {
  var formData = new FormData();

  _.forIn(params, (value, key) => {
    formData.append(key, value);
  });
  return await axios
    .post('https://upload.pubble.io/', formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    .then((res) => {
      console.log('uploadFile res', res);
      return res.data;
    })
    .catch((error) => {
      console.log('uploadFile error', error);
      return error;
    });
}

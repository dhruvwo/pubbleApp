import {PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import ToastService from './ToastService';
import * as _ from 'lodash';
import FileViewer from 'react-native-file-viewer';

export async function downloadFile(fileUrl) {
  if (Platform.OS === 'ios') {
    startDownload(fileUrl);
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
        startDownload(fileUrl);
      } else {
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      console.log('++++' + err);
    }
  }
}

function getFileName(fileUrl) {
  let newFileUrl = _.clone(fileUrl);
  const splitData = newFileUrl.split('/');
  newFileUrl = splitData[splitData.length - 1];
  return newFileUrl;
}

const startDownload = async (fileUrl) => {
  let file_Name = getFileName(fileUrl);
  const {config, fs} = RNFetchBlob;
  let RootDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: `${RootDir}/${file_Name}`,
      description: 'downloading file...',
      notification: true,
      useDownloadManager: true,
    },
  };
  return await config(options)
    .fetch('GET', fileUrl)
    .then(async (downloadedRes) => {
      ToastService({
        message: 'File Downloaded Successfully.',
      });
      return await FileViewer.open(downloadedRes.path(), {
        showAppsSuggestions: true,
      })
        .then((res) => {
          return res;
        })
        .catch((error) => {
          console.log('error in open file', error);
          return error;
        });
    })
    .catch((err) => {
      ToastService({
        message: 'Failed to download file, please try again.',
      });
      console.log('errior file download', err);
      return err;
    });
};

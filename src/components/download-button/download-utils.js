import RNFetchBlob from 'rn-fetch-blob';
// eslint-disable-next-line no-unused-vars
import { Platform } from 'react-native';
// import RNFS from 'react-native-fs';

let dirs = RNFetchBlob.fs.dirs;

export const downloadPath = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
// export const downloadPath = dirs.DocumentDir; /// Download manager could not resolve downloaded file path.

export default function getConfig(video) {
  const { videoId, title } = video;

  const titlesplit = title.split(' ');
  const titlejoin = titlesplit.join('_');
  const filename = `${videoId}_${titlejoin}.mp4`;

  return {
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: title,
      path: `${downloadPath}/${filename}`
    },
    trusty: true,
    fileCache: true,
    path: `${downloadPath}/${filename}`
  };
}

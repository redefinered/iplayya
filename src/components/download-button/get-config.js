import RNFetchBlob from 'rn-fetch-blob';
let dirs = RNFetchBlob.fs.dirs;
const downloadPath = dirs.DocumentDir;

export default function getConfig(video) {
  const { videoId, title } = video;

  const titlesplit = title.split(' ');
  const titlejoin = titlesplit.join('_');
  const filename = `${videoId}_${titlejoin}.mp4`;

  return {
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: title
      // path: `${downloadPath}/${video.videoId}_${title}.mp4`
    },
    fileCache: true,
    path: `${downloadPath}/${filename}`
  };
}

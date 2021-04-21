import RNBackgroundDownloader from 'react-native-background-downloader';

export const downloadPath = RNBackgroundDownloader.directories.documents;

export const getFilename = (video) => {
  const { videoId, title } = video;

  const titlesplit = title.split(' ');
  const titlejoin = titlesplit.join('_');
  const filename = `${videoId}_${titlejoin}.mp4`;

  return filename;
};

export default function getConfig(video) {
  const filename = getFilename(video);

  return {
    id: video.videoId,
    // url: video.url,
    url:
      'https://firebasestorage.googleapis.com/v0/b/iplayya.appspot.com/o/12AngryMen.mp4?alt=media&token=e5fbea09-e383-4fbb-85bd-206bceb4ef4d',
    destination: `${downloadPath}/${filename}`
  };
}

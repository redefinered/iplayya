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
    url: video.url,
    // url: 'http://84.17.37.2/boxoffice/1080p/GodzillaVsKong-2021-1080p.mp4',
    destination: `${downloadPath}/${filename}`
  };
}

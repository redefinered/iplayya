import RNBackgroundDownloader from 'react-native-background-downloader';
import moment from 'moment';

export const createFontFormat = (fontSize, lineHeight) => {
  return { fontSize, lineHeight };
};

export const urlEncodeTitle = (title) => {
  if (!title) return;
  const strsplit = title.split(' ');
  return strsplit.join('+');
};

export const toDateTime = (secs) => {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
};

/**
 * Generate an array of days starting from now
 * @param {number} numberDays the number of days to generate
 */
export const generateDatesFromToday = (numberDays = 7) => {
  let dates = [];

  for (let i = 0; i < numberDays; i++) {
    dates.push({
      id: i + 1,
      value: moment().add(i, 'days').valueOf(),
      formatted: moment().add(i, 'days').format('ddd, MMM D')
    });
  }

  return dates;
};

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
    url: 'http://84.17.37.2/boxoffice/1080p/GodzillaVsKong-2021-1080p.mp4',
    destination: `${downloadPath}/${filename}`
  };
}

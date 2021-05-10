import RNBackgroundDownloader from 'react-native-background-downloader';
import { PermissionsAndroid, Platform } from 'react-native';
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
  const { videoId, title, is_series, currentEpisode } = video;

  const titlesplit = title.split(' ');
  const titlejoin = titlesplit.join('_');

  let filename = `${videoId}_${titlejoin}.mp4`;

  if (is_series) {
    filename = `${videoId}SO${currentEpisode.season}E${currentEpisode.episode}_${titlejoin}.mp4`;
  }

  return filename;
};

export const getConfig = (video) => {
  const filename = getFilename(video);

  const { videoId, url, is_series, currentEpisode } = video;

  let taskId = is_series
    ? `${videoId}SO${currentEpisode.season}E${currentEpisode.episode}`
    : videoId;

  return {
    id: taskId,
    url: url,
    destination: `${downloadPath}/${filename}`
  };
};

export const requestWritePermissionAndroid = async () => {
  if (Platform.OS === 'ios') return;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permission to write into file storage',
        message: 'The app needs access to your file storage so you can download the file',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );

    const readgrant = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('No write access');
    }

    if (readgrant !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('No read access');
    }

    return PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    throw new Error(error.message);
  }
};

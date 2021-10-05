import RNBackgroundDownloader from 'react-native-background-downloader';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';

export const downloadPath = RNBackgroundDownloader.directories.documents;

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

  /// include past days equal to number of days
  let includePastNumberDays = numberDays * 2;

  for (let i = 0; i < includePastNumberDays; i++) {
    // let time = moment().startOf('day');
    let time = moment();

    let date = time.subtract(numberDays - i, 'day');

    dates.push({
      id: i + 1,
      // date: date.valueOf(),

      longFormat: date.format('dddd, MMMM Do YYYY, h:mm:ss a'),
      formatted: date.format('ddd, MMM D'),
      value: date.valueOf()
    });
  }

  return dates;
};

export const getFilename = (video) => {
  const { videoId, title, is_series, currentEpisode } = video;

  const titlesplit = title.split(' ');
  const titlejoin = titlesplit.join('_');

  let filename = `${videoId}_${titlejoin}.mp4`;

  if (is_series) {
    let ep = `SO${currentEpisode.season}E${currentEpisode.episode}`; /// e.g. SO3E2
    filename = `${videoId}${ep}_${titlejoin}.mp4`;
  }

  return filename;
};

export const getConfigForVideoDownload = (video) => {
  const filename = getFilename(video);

  const { videoId, url, is_series, currentEpisode } = video;

  let taskId = is_series
    ? `${videoId}SO${currentEpisode.season}E${currentEpisode.episode}`
    : videoId;

  return {
    // id: `V_${taskId}`, /// add V_ to identify videos in downloads
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

export const toTitleCase = (str) => {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};

/**
 * checks whether a track is downloaded using track ID
 * @param {string} trackId ID of a track being downloaded
 * @returns boolean
 */
export const isTrackDownloaded = async (trackId) => {
  const ls = await RNFetchBlob.fs.ls(downloadPath);
  const fileIds = ls.map((file) => {
    /// filename is of shape %{type}_${id}_${track_name}
    // split to get the ID at index 1
    let split = file.split('_');

    /// the ID of the downloaded track
    return split[1];
  });

  if (fileIds.length) {
    /// check if trackId is among the IDS of downloaded files
    const check = fileIds.find((f) => f === trackId);

    if (typeof check !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  /// return false if there is no downloaded file because that means the track is not downloaded
  return false;
};

/**
 * create a filename for a track to for download
 * @param {object} track contains id and title proprty
 * @returns a string filename with type, id, and title separated with underscores
 */
export const createFilenameForAudioTrack = (track) => {
  const { taskId, name } = track;

  // convert spaces to underscores
  const tsplit = name.split(' ');
  const tjoin = tsplit.join('_');

  return `${taskId}_${tjoin}.mp3`;
};

export const checkIfTrackOrAlbumIsDownloaded = async (sub) => {
  let type = 'track';

  /// sub is either a track or an album object
  if (typeof sub.tracks !== 'undefined') type = 'album';

  /// get downloaded files
  const ls = await RNFetchBlob.fs.ls(downloadPath);

  /// get ids of all audio files
  const fileIds = ls.map((file) => {
    const fSplit = file.split('_');
    /// if item is an audio return its ID, else return not_audio
    return fSplit[0] === 'a' ? fSplit[1] : 'not_audio';
  });
  const audioIds = fileIds.filter((id) => id !== 'not_audio');
  console.log({ sub, audioIds, type });

  if (type === 'track') {
    /// return true if sub.id is in the extracted array, otherwise return false
    if (typeof audioIds.find((id) => id === sub.id) === 'undefined') {
      return false;
    } else {
      return true;
    }
  } else {
    /// if type is not track, so 'album' will match this condition
    let missingAtleastOne = false;

    for (let i = 0; i < sub.tracks.length; i++) {
      const track = sub.tracks[i];
      if (typeof audioIds.find((id) => id === track.id) === 'undefined') {
        missingAtleastOne = true;
        break;
      }
    }

    if (missingAtleastOne) {
      return false;
    } else {
      return true;
    }
  }
};

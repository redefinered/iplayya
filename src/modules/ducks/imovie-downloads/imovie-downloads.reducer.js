import { createReducer } from 'reduxsauce';
import { Types } from './imovie-downloads.actions';
import {
  updateDownloadsCollection,
  removeFinishedDownloads,
  removeDownloadsByIds
} from './imovie-downloads.utils';

const INITIAL_STATE = {
  error: null,
  isFetching: false,

  // download tasks
  downloads: [],

  // downloads progress
  downloadsProgress: [],

  downloadStarted: false
};

export default createReducer(INITIAL_STATE, {
  [Types.DOWNLOAD_START]: (state) => {
    return {
      ...state,
      isFetching: false,
      error: null,
      downloadStarted: false
    };
  },
  [Types.UPDATE_DOWNLOADS]: (state, action) => {
    const downloads = updateDownloadsCollection(state, action);
    return {
      ...state,
      isFetching: true,
      downloads
    };
  },
  [Types.DOWNLOAD_STARTED]: (state) => {
    return {
      ...state,
      isFetching: false,
      downloadStarted: true,
      error: null
    };
  },
  [Types.DOWNLOAD_START_FAILURE]: (state, action) => {
    return {
      ...state,
      isFetching: false,
      error: action.error,
      downloadStarted: false
    };
  },
  [Types.UPDATE_DOWNLOADS_PROGRESS]: (state, action) => {
    return {
      ...state,
      downloadsProgress: [action.data, ...state.downloadsProgress]
    };
  },

  [Types.CLEAN_UP_DOWNLOADS_PROGRESS]: (state, action) => {
    const downloadsProgress = removeFinishedDownloads(state, action);

    return {
      ...state,
      downloadsProgress
    };
  },

  [Types.RESET_DOWNLOADS_PROGRESS]: (state) => {
    return {
      ...state,
      downloadsProgress: []
    };
  },

  [Types.REMOVE_DOWNLOADS_BY_IDS]: (state, action) => {
    const downloads = removeDownloadsByIds(state, action);

    return {
      ...state,
      downloads
    };
  },

  /// reset to original, untouched state.
  // for some reason, returnung INITIAL_STATE here does not do what is expected
  [Types.RESET]: (state) => {
    return {
      ...state,
      error: null,
      isFetching: false,
      downloads: [],
      downloadsProgress: [],
      downloadStarted: false
    };
  }
});

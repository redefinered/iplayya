import { createReducer } from 'reduxsauce';
import { Types } from './downloads.actions';

const INITIAL_STATE = {
  error: null,
  isFetching: false,

  // download tasks
  downloads: [],

  // downloads progress
  downloadsProgress: [],

  // data for downloaded movies where we get properties like title, id, etc...
  downloadsData: [],

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
    const { downloadTask } = action;
    return {
      ...state,
      isFetching: true,
      downloads: [downloadTask, ...state.downloads]
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
    const { id, ...progress } = action.data;
    return {
      ...state,
      downloadsProgress: [...state.downloadsProgress, { id, ...progress }]
    };
  },

  [Types.CLEAN_UP_DOWNLOADS_PROGRESS]: (state, action) => {
    const { ids } = action;
    const downloadsProgress = state.downloadsProgress;
    let incompleteItems = [];
    ids.forEach((removeId) => {
      incompleteItems = downloadsProgress.filter(({ id }) => id !== removeId);
    });

    return {
      ...state,
      downloadsProgress: incompleteItems
    };
  },

  [Types.RESET_DOWNLOADS_PROGRESS]: (state) => {
    return {
      ...state,
      downloadsProgress: []
    };
  },

  // [Types.GET_DOWNLOADS]: (state) => {
  //   return {
  //     ...state,
  //     isFetching: true,
  //     error: null,
  //     downloadsData: []
  //   };
  // },
  // [Types.GET_DOWNLOADS_SUCCESS]: (state, action) => {
  //   return {
  //     ...state,
  //     isFetching: false,
  //     error: null,
  //     downloadsData: action.data
  //   };
  // },
  // [Types.GET_DOWNLOADS_FAILURE]: (state) => {
  //   return {
  //     ...state,
  //     isFetching: false,
  //     error: null
  //   };
  // },

  [Types.REMOVE_DOWNLOADS_BY_IDS]: (state, action) => {
    let { downloads } = state;
    const { ids } = action;
    ids.forEach((id) => {
      let index = downloads.findIndex(({ movie }) => movie.id === id);
      console.log({ index, downloads, ids });
      if (index >= 0) {
        downloads.splice(index, 1);
      }
    });

    return {
      ...state,
      downloads
    };
  },
  [Types.RESET]: () => {
    return INITIAL_STATE;
  }
});

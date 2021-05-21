import { createReducer } from 'reduxsauce';
import { Types } from './iplay.actions';

const INITIAL_STATE = {
  videoFiles: []
};

export default createReducer(INITIAL_STATE, {
  [Types.ADD_VIDEO_FILES]: (state, actions) => {
    return {
      ...state,
      videoFiles: [...actions.files, ...state.videoFiles]
    };
  },
  [Types.DELETE_VIDEO_FILES]: (state, actions) => {
    const newFiles = state.videoFiles.filter((v) => !actions.fileIds.includes(v.id));
    return {
      ...state,
      videoFiles: newFiles
    };
  }
});

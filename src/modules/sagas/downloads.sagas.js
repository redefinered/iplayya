/* eslint-disable prettier/prettier */
import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/downloads/downloads.actions';
import { getDownloads } from 'services/download.service';

export function* getDownloadsRequest(action) {
  const { input } = action.data;
  try {
    const { videoByIds } = yield call(getDownloads, input);
    yield put(Creators.getDownloadsSuccess(videoByIds));
  } catch (error) {
    yield put(Creators.getDownloadsFailure(error.message));
  }
}

export default function* downloadsSagas() {
  yield takeLatest(Types.GET_DOWNLOADS, getDownloadsRequest);
}
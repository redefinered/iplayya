// eslint-disable-next-line no-unused-vars
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import { Creators } from 'modules/app';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = getStatusBarHeight();
const HEADER_BUTTON_HEIGHT = 44; //44
const HEADER_SPACE_FROM_TOP_BUTTONS = 74; //74

export function* appReady() {
  try {
    let HEADER_HEIGHT = HEADER_BUTTON_HEIGHT + HEADER_SPACE_FROM_TOP_BUTTONS - STATUSBAR_HEIGHT;
    // HEADER_HEIGHT = HEADER_HEIGHT + 20;

    // call setHeaderHeight function to set height on app ready
    yield put(Creators.setHeaderHeight(parseInt(HEADER_HEIGHT.toFixed(2))));

    // This action will be launched after Finishing Store Rehydrate
    yield put(Creators.appReadySuccess());
  } catch (e) {
    yield put(Creators.appReadyFailure(e.message));
  }
}

export default function* watchApp() {
  yield takeLatest(REHYDRATE, appReady);
}

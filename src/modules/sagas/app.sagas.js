// eslint-disable-next-line no-unused-vars
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import { Creators } from 'modules/app';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = getStatusBarHeight();

console.log({ STATUSBAR_HEIGHT });

const HEADER_BUTTON_HEIGHT = 54; //44
const HEADER_SPACE_FROM_TOP_BUTTONS = 94; //74

// console.log({ STATUSBAR_HEIGHT, HEADER_HEIGHT: HEADER_HEIGHT.toFixed(2) });

// import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
// import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
// import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
// import { get as getProfile } from 'services/profile.service';
// import { getGenres } from 'services/itv.service';
// import { getGenres as getMusicGenres } from 'services/music.service';

export function* appReady() {
  // if (typeof state.payload === 'undefined') return;

  // const { isLoggedIn } = state.payload.auth;

  try {
    // if (isLoggedIn) {
    //   const { me: profile } = yield call(getProfile);
    //   const { iptvGenres } = yield call(getGenres);
    //   const { albumGenres } = yield call(getMusicGenres);

    //   yield put(ProfileCreators.getSuccess({ profile }));
    //   yield put(ItvCreators.getGenresSuccess(iptvGenres));
    //   yield put(MusicCreators.getGenresSuccess(albumGenres));
    // }

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
  // yield takeLatest(Types.APP_READY, appReady);
}

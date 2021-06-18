// eslint-disable-next-line no-unused-vars
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import { Creators } from 'modules/app';
import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
import { get as getProfile } from 'services/profile.service';
import { getGenres } from 'services/itv.service';
import { getGenres as getMusicGenres } from 'services/music.service';

export function* appReady(state) {
  if (typeof state.payload === 'undefined') return;

  const { isLoggedIn } = state.payload.auth;

  try {
    if (isLoggedIn) {
      const { me: profile } = yield call(getProfile);
      const { iptvGenres } = yield call(getGenres);
      const { albumGenres } = yield call(getMusicGenres);

      yield put(ProfileCreators.getSuccess({ profile }));
      yield put(ItvCreators.getGenresSuccess(iptvGenres));
      yield put(MusicCreators.getGenresSuccess(albumGenres));
    }

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

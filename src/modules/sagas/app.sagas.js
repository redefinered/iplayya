// eslint-disable-next-line no-unused-vars
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import { Creators } from 'modules/ducks/app.reducer';
// import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
// import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';
// import { getCategories } from 'services/movies.service';
// import { getGenres } from 'services/music.service';

export function* appReady() {
  try {
    // setup music genres and vod categories when app mounts
    // const [{ categories }, { albumGenres }] = yield all([call(getCategories), call(getGenres)]);

    // yield put(MoviesCreators.getCategoriesSuccess({ categories }));
    // yield put(MusicCreators.getGenresSuccess({ genres: albumGenres }));

    // This action will be launched after Finishing Store Rehydrate
    yield put(Creators.appReadySuccess());
  } catch (e) {
    yield put(Creators.appReadyFailure(e.message));
  }
}

export default function* watchApp() {
  yield takeLatest(REHYDRATE, appReady);
}

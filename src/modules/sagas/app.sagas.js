// eslint-disable-next-line no-unused-vars
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';
import { Types, Creators } from 'modules/app';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { setProvider } from 'services/user.service';

// service methods for fetching movie categories and itv genres
import { getGenres as getItvGenres } from 'services/itv.service';
import { getCategories as getMovieCategories } from 'services/movies.service';
import { getGenres as getIsportsGenres } from 'services/isports.service';
import { getGenres as getMusicGenres } from 'services/music.service';

const STATUSBAR_HEIGHT = getStatusBarHeight();
const HEADER_BUTTON_HEIGHT = 44; //44
const HEADER_SPACE_FROM_TOP_BUTTONS = 74; //74

export function* setProviderRequest(action) {
  const { id } = action;
  try {
    const {
      setAsDefaultProvider: { ...selectedProvider }
    } = yield call(setProvider, { id });

    // fetch categories and genres here
    const { isportsGenres } = yield call(getIsportsGenres);
    const { iptvGenres } = yield call(getItvGenres);
    const { categories: movieCategories } = yield call(getMovieCategories);
    const { albumGenres: musicGenres } = yield call(getMusicGenres);

    /// filters out isports from itv channels
    let filteredItvGenres = [];
    for (let i = 0; i < iptvGenres.length; i++) {
      const genre = iptvGenres[i];
      let x = isportsGenres.find(({ id }) => id === genre.id);
      if (typeof x === 'undefined') filteredItvGenres.push(genre);
    }

    yield put(
      Creators.setProviderSuccess(selectedProvider, {
        itvGenres: filteredItvGenres,
        movieCategories,
        isportsGenres,
        musicGenres
      })
    );
  } catch (error) {
    yield put(Creators.setProviderFailure(error.message));
  }
}

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
  yield takeLatest(Types.SET_PROVIDER, setProviderRequest);
  yield takeLatest(REHYDRATE, appReady);
}

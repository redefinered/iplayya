import { takeLatest, call, put } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/user/user.actions';
import { updatePlaybackSettings, setProvider } from 'services/user.service';

import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as IsportsCreators } from 'modules/ducks/isports/isports.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';

import { getGenres as getItvGenres } from 'services/itv.service';
import { getCategories } from 'services/movies.service';
import { getGenres as getIsportsGenres } from 'services/isports.service';
import { getGenres as getMusicGenres } from 'services/music.service';

export function* updateProfileSettingsRequest(action) {
  const { input } = action.data;
  try {
    const { updatePlaybackSetting } = yield call(updatePlaybackSettings, input);
    console.log({ updatePlaybackSetting });
    yield put(Creators.updatePlaybackSettingsSuccess());
  } catch (error) {
    yield put(Creators.updatePlaybackSettingsFailure(error.message));
  }
}

export function* setProviderRequest(action) {
  const { id } = action;
  try {
    const {
      setAsDefaultProvider: { id: selectedProviderId }
    } = yield call(setProvider, { id });

    // fetch categories and genres here
    const { isportsGenres } = yield call(getIsportsGenres);
    const { iptvGenres } = yield call(getItvGenres);
    const { categories } = yield call(getCategories);
    const { albumGenres } = yield call(getMusicGenres);

    yield put(MoviesCreators.getCategoriesSuccess(categories));
    yield put(IsportsCreators.getGenresSuccess(isportsGenres));
    yield put(MusicCreators.getGenresSuccess(albumGenres));

    /// filters out isports from itv channels
    let filteredItvGenres = [];
    for (let i = 0; i < iptvGenres.length; i++) {
      const genre = iptvGenres[i];
      let x = isportsGenres.find(({ id }) => id === genre.id);
      if (typeof x === 'undefined') filteredItvGenres.push(genre);
    }

    yield put(ItvCreators.getGenresSuccess(filteredItvGenres));

    yield put(Creators.setProviderSuccess(selectedProviderId));
  } catch (error) {
    yield put(Creators.setProviderFailure(error.message));
  }
}

export default function* userSagas() {
  yield takeLatest(Types.UPDATE_PLAYBACK_SETTINGS, updateProfileSettingsRequest);
  yield takeLatest(Types.SET_PROVIDER, setProviderRequest);
}

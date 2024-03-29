import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/provider/provider.actions';
import {
  create as createProvider,
  update as updateProvider,
  deleteOne as deleteProvider
} from 'services/provider.service';

import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as IsportsCreators } from 'modules/ducks/isports/isports.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';

import { getGenres as getItvGenres } from 'services/itv.service';
import { getCategories } from 'services/movies.service';
import { getGenres as getIsportsGenres } from 'services/isports.service';
import { getGenres as getMusicGenres } from 'services/music.service';

export function* createRequest(action) {
  const { input } = action.data;
  try {
    const { createUserProvider } = yield call(createProvider, input);

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

    yield put(Creators.createSuccess({ createUserProvider }));
  } catch (error) {
    yield put(Creators.createFailure(error.message));
  }
}

export function* updateRequest(action) {
  const { input: args } = action.data;
  try {
    const { updateUserProvider } = yield call(updateProvider, args);
    console.log({ updateUserProvider });
    yield put(Creators.updateSuccess());
  } catch (error) {
    yield put(Creators.updateFailure(error.message));
  }
}

export function* deleteRequest(action) {
  const { ids } = action.data;
  try {
    // const { deleteUserProvider } = yield call(deleteProvider, id);
    yield all(ids.map((i) => call(deleteProvider, i)));
    yield put(Creators.deleteSuccess());
  } catch (error) {
    yield put(Creators.deleteFailure(error.message));
  }
}

export default function* providerSagas() {
  // yield takeLatest(Types.GET, getRequest);
  yield takeLatest(Types.CREATE, createRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
  yield takeLatest(Types.DELETE, deleteRequest);
}

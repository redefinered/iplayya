import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/iradio-favorites/iradio-favorites.actions';
import { getFavorites, removeFromFavorites } from 'services/iradio.service';

export function* getFavoritesRequest(action) {
  const { input } = action;
  try {
    // TODO: input should come from stat, pageNumber should be incremented for every request
    const { favoriteRadios: favorites } = yield call(getFavorites, input);

    const newData = favorites.map((d) => ({ ...d, pn: input.pageNumber }));

    /// increment paginator pageNumber
    Object.assign(input, { pageNumber: input.pageNumber + 1 });

    yield put(Creators.getFavoritesSuccess(newData, input));
  } catch (error) {
    yield put(Creators.getFavoritesFailure(error.message));
  }
}

export function* removeFromFavoritesRequest(action) {
  const { radios } = action;
  try {
    yield all(radios.map(({ id, pn }) => call(removeFromFavorites, id, pn)));
    yield put(Creators.removeFromFavoritesSuccess(radios));
  } catch (error) {
    yield put(Creators.removeFromFavoritesFailure(error.message));
  }
}

export default function* iradioFavoritesSagas() {
  yield takeLatest(Types.GET_FAVORITES, getFavoritesRequest);
  yield takeLatest(Types.REMOVE_FROM_FAVORITES, removeFromFavoritesRequest);
}

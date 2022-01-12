import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/iradio-favorites/iradio-favorites.actions';
import { getFavorites, addToFavorites, removeFromFavorites } from 'services/iradio.service';

export function* getFavoritesRequest(action) {
  const { input } = action;
  try {
    const { favoriteRadios } = yield call(getFavorites, input);
    yield put(Creators.getFavoritesSuccess(favoriteRadios));
  } catch (error) {
    yield put(Creators.getFavoritesFailure(error.message));
  }
}

export function* addToFavoritesRequest(action) {
  try {
    const { radio } = action;
    const { addRadioToFavorites: r } = yield call(addToFavorites, radio);
    // if (addRadioToFavorites.status !== 'success') throw new Error('Something went wrong');
    yield put(Creators.addToFavoritesSuccess(r));
  } catch (error) {
    yield put(Creators.addToFavoritesFailure(error.message));
  }
}

export function* removeFromFavoritesRequest(action) {
  try {
    const { radios } = action;
    yield all(radios.map((r) => call(removeFromFavorites, r)));
    yield put(Creators.removeFromFavoritesSuccess());
  } catch (error) {
    yield put(Creators.removeFromFavoritesFailure(error.message));
  }
}

export default function* iradioFavoritesSagas() {
  yield takeLatest(Types.GET_FAVORITES, getFavoritesRequest);
  yield takeLatest(Types.ADD_TO_FAVORITES, addToFavoritesRequest);
  yield takeLatest(Types.REMOVE_FROM_FAVORITES, removeFromFavoritesRequest);
}

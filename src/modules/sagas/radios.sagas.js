import { call, put, takeLatest } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/radios/radios.actions';
import {
  getStations,
  getFavorites,
  addToFavorites,
  removeFromFavorites
} from 'services/radios.service';

export function* getRequest(action) {
  const { ...input } = action.data;
  try {
    // TODO: input should come from stat, pageNumber should be incremented for every request
    const { radios: radioStations } = yield call(getStations, input);
    yield put(Creators.getSuccess({ radioStations }));
  } catch (error) {
    yield put(Creators.getFailure(error.message));
  }
}

export function* getFavoritesRequest(action) {
  const { ...input } = action.data;
  try {
    // TODO: input should come from stat, pageNumber should be incremented for every request
    const { favoriteRadios: favorites } = yield call(getFavorites, input);
    yield put(Creators.getFavoritesSuccess({ favorites }));
  } catch (error) {
    yield put(Creators.getFavoritesFailure(error.message));
  }
}

export function* addToFavoritesRequest(action) {
  try {
    const {
      addRadioToFavorites: { status, message }
    } = yield call(addToFavorites, action.radioId);
    console.log(message);
    if (status !== 'success') throw new Error('Something went wrong');
    yield put(Creators.addToFavoritesSuccess());
  } catch (error) {
    yield put(Creators.addToFavoritesFailure(error.message));
  }
}

export function* removeFromFavoritesRequest(action) {
  try {
    const {
      removeRadioToFavorites: { status, message }
    } = yield call(removeFromFavorites, action.radioId);
    console.log(message);
    if (status !== 'success') throw new Error('Something went wrong');
    yield put(Creators.removeFromFavoritesSuccess(action.radioId));
  } catch (error) {
    yield put(Creators.removeFromFavoritesFailure(error.message));
  }
}

export default function* radiosSagas() {
  yield takeLatest(Types.GET, getRequest);
  yield takeLatest(Types.GET_FAVORITES, getFavoritesRequest);
  yield takeLatest(Types.ADD_TO_FAVORITES, addToFavoritesRequest);
  yield takeLatest(Types.REMOVE_FROM_FAVORITES, removeFromFavoritesRequest);
}

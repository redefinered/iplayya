import { call, put, takeLatest, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/iradio/iradio.actions';
import {
  getStations,
  getFavorites,
  addToFavorites,
  removeFromFavorites
} from 'services/iradio.service';

export function* getRequest(action) {
  // const { ...input } = action.data;
  const { limit, pageNumber } = action.input;

  /// increment pageNumber each successful request
  const nextPaginatorInfo = { limit, pageNumber: pageNumber + 1 };
  try {
    // TODO: input should come from stat, pageNumber should be incremented for every request
    const { radios: radioStations } = yield call(getStations, action.input);
    yield put(Creators.getSuccess(radioStations, nextPaginatorInfo));
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
    // const {
    //   addRadioToFavorites: { status, message }
    const { addRadioToFavorites } = yield call(addToFavorites, action.radioId);
    // console.log(message);
    if (addRadioToFavorites.status !== 'success') throw new Error('Something went wrong');
    yield put(Creators.addToFavoritesSuccess());
  } catch (error) {
    yield put(Creators.addToFavoritesFailure(error.message));
  }
}

export function* removeFromFavoritesRequest(action) {
  const { radioIds } = action;
  try {
    const response = yield all(radioIds.map((id) => call(removeFromFavorites, { radioId: id })));
    console.log({ response });
    // const {
    //   removeRadioToFavorites: { status, message }
    // } = yield call(removeFromFavorites, action.radioId);
    // console.log(message);
    // if (status !== 'success') throw new Error('Something went wrong');
    yield put(Creators.removeFromFavoritesSuccess());
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

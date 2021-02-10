import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/itv/itv.actions';
import { getGenres, getChannels, getChannelsByCategory } from 'services/itv.service';

export function* getGenresRequest() {
  try {
    const { iptvGenres } = yield call(getGenres);
    yield put(Creators.getGenresSuccess(iptvGenres));
  } catch (error) {
    yield put(Creators.getGenresFailure(error.message));
  }
}

export function* getChannelsRequest(action) {
  const { limit, pageNumber } = action.input;

  /// increment pageNumber each successful request
  const nextPaginatorInfo = { limit, pageNumber: pageNumber + 1 };

  try {
    const { iptvs } = yield call(getChannels, action.input);
    yield put(Creators.getChannelsSuccess({ channels: iptvs, nextPaginatorInfo }));
  } catch (error) {
    yield put(Creators.getChannelsFailure(error.message));
  }
}

export function* getChannelsByCategoriesRequest(action) {
  const { limit, pageNumber } = action.input;

  /// increment pageNumber each successful request
  const nextPaginatorInfo = { limit, pageNumber: pageNumber + 1 };

  try {
    const { iptvByCategory } = yield call(getChannelsByCategory, action.input);
    yield put(
      Creators.getChannelsByCategoriesSuccess({ channels: iptvByCategory, nextPaginatorInfo })
    );
  } catch (error) {
    yield put(Creators.getChannelsByCategoriesFailure(error.message));
  }
}

export default function* itvSagas() {
  yield takeLatest(Types.GET_GENRES, getGenresRequest);
  yield takeLatest(Types.GET_CHANNELS, getChannelsRequest);
  yield takeLatest(Types.GET_CHANNELS_BY_CATEGORIES, getChannelsByCategoriesRequest);
}

import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/itv/itv.actions';
import {
  getGenres,
  getChannel,
  getChannels,
  getChannelsByCategory,
  getChannelToken,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getProgramsByChannel,
  search
} from 'services/itv.service';

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
    yield put(Creators.getChannelsSuccess(iptvs, nextPaginatorInfo));
  } catch (error) {
    yield put(Creators.getChannelsFailure(error.message));
  }
}

export function* getChannelRequest(action) {
  try {
    const { iptv: channel } = yield call(getChannel, action.input);

    /// get token
    const {
      getItvChannelToken: { token }
    } = yield call(getChannelToken, { channelId: action.input.videoId });

    yield put(Creators.getChannelSuccess(channel, token));
  } catch (error) {
    yield put(Creators.getChannelFailure(error.message));
  }
}

export function* getChannelsByCategoriesRequest(action) {
  const { limit, pageNumber } = action.input;

  /// increment pageNumber each successful request
  const nextPaginatorInfo = { limit, pageNumber: pageNumber + 1 };

  try {
    const { iptvByCategory } = yield call(getChannelsByCategory, action.input);
    yield put(Creators.getChannelsByCategoriesSuccess(iptvByCategory, nextPaginatorInfo));
  } catch (error) {
    yield put(Creators.getChannelsByCategoriesFailure(error.message));
  }
}

export function* addToFavoritesRequest(action) {
  try {
    const { addIptvToFavorites } = yield call(addToFavorites, action.videoId);
    if (addIptvToFavorites.status !== 'success') throw new Error('Error adding item to favorites');
    yield put(Creators.addToFavoritesSuccess());
  } catch (error) {
    yield put(Creators.addToFavoritesFailure(error.message));
  }
}

export function* removeFromFavoritesRequest(action) {
  const { channelIds } = action;
  try {
    const response = yield all(channelIds.map((id) => call(removeFromFavorites, { videoId: id })));
    // const { removeIptvToFavorites } = yield call(removeFromFavorites, { videoId: 4117 });
    console.log({ response });
    yield put(Creators.removeFromFavoritesSuccess());
  } catch (error) {
    yield put(Creators.removeFromFavoritesFailure(error.message));
  }
}

export function* getFavoritesRequest(action) {
  const { input } = action;
  try {
    const { favoriteIptvs } = yield call(getFavorites, input);

    /// increment paginator pageNumber
    Object.assign(input, { pageNumber: input.pageNumber + 1 });

    yield put(Creators.getFavoritesSuccess(favoriteIptvs, input));
  } catch (error) {
    yield put(Creators.getFavoritesFailure(error.message));
  }
}

export function* getProgramsByChannelRequest(action) {
  const { input } = action;
  try {
    const { getPrograms: programs } = yield call(getProgramsByChannel, input);
    yield put(Creators.getProgramsByChannelSuccess(programs));
  } catch (error) {
    yield put(Creators.getProgramsByChannelFailure(error.message));
  }
}

export function* searchRequest(action) {
  const { limit, pageNumber } = action.input;
  const { shouldIncrement } = action;

  try {
    const { iptvs: results } = yield call(search, action.input);

    /// increment pageNumber each successful request
    const nextPaginatorInfo = { limit, pageNumber: shouldIncrement ? pageNumber + 1 : pageNumber };

    // console.log({ loc: 'saga', ...nextPaginatorInfo });
    yield put(Creators.searchSuccess(results, nextPaginatorInfo));
  } catch (error) {
    yield put(Creators.searchFailure(error.message));
  }
}

export default function* itvSagas() {
  yield takeLatest(Types.GET_GENRES, getGenresRequest);
  yield takeLatest(Types.GET_CHANNEL, getChannelRequest);
  yield takeLatest(Types.GET_CHANNELS, getChannelsRequest);
  yield takeLatest(Types.GET_CHANNELS_BY_CATEGORIES, getChannelsByCategoriesRequest);
  yield takeLatest(Types.ADD_TO_FAVORITES, addToFavoritesRequest);
  yield takeLatest(Types.REMOVE_FROM_FAVORITES, removeFromFavoritesRequest);
  yield takeLatest(Types.GET_FAVORITES, getFavoritesRequest);
  yield takeLatest(Types.GET_PROGRAMS_BY_CHANNEL, getProgramsByChannelRequest);
  yield takeLatest(Types.SEARCH, searchRequest);
}

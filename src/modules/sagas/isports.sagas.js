import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/isports/isports.actions';
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
} from 'services/isports.service';

export function* getGenresRequest() {
  try {
    const { isportsGenres } = yield call(getGenres);
    yield put(Creators.getGenresSuccess(isportsGenres));
  } catch (error) {
    yield put(Creators.getGenresFailure(error.message));
  }
}

export function* getChannelsRequest(action) {
  const { limit, pageNumber } = action.input;

  /// increment pageNumber each successful request
  const nextPaginatorInfo = { limit, pageNumber: pageNumber + 1 };

  try {
    const { isports } = yield call(getChannels, action.input);
    yield put(Creators.getChannelsSuccess({ channels: isports, nextPaginatorInfo }));
  } catch (error) {
    yield put(Creators.getChannelsFailure(error.message));
  }
}

export function* getChannelRequest(action) {
  try {
    const { isport: channel } = yield call(getChannel, action.input);
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
    const { isportsByCategory } = yield call(getChannelsByCategory, action.input);
    yield put(
      Creators.getChannelsByCategoriesSuccess({ channels: isportsByCategory, nextPaginatorInfo })
    );
  } catch (error) {
    yield put(Creators.getChannelsByCategoriesFailure(error.message));
  }
}

export function* addToFavoritesRequest(action) {
  try {
    const { addIsportToFavorites } = yield call(addToFavorites, action.videoId);
    if (addIsportToFavorites.status !== 'success')
      throw new Error('Error adding item to favorites');
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
    const { favoriteIsports } = yield call(getFavorites, input);

    /// increment paginator pageNumber
    Object.assign(input, { pageNumber: input.pageNumber + 1 });

    yield put(Creators.getFavoritesSuccess(favoriteIsports, input));
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
  try {
    const { isports: results } = yield call(search, action.input);
    yield put(Creators.searchSuccess(results));
  } catch (error) {
    yield put(Creators.searchFailure(error.message));
  }
}

export function* getSimilarChannelRequest(action) {
  try {
    const { isportsByCategory: results } = yield call(getChannelsByCategory, action.input);
    // console.log({ results });
    yield put(Creators.getSimilarChannelSuccess(results));
  } catch (error) {
    yield put(Creators.getSimilarChannelFailure(error.message));
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
  yield takeLatest(Types.GET_SIMILAR_CHANNEL, getSimilarChannelRequest);
  yield takeLatest(Types.GET_PROGRAMS_BY_CHANNEL, getProgramsByChannelRequest);
}

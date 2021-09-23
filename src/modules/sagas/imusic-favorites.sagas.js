import { call, put, takeLatest } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/imusic-favorites/imusic-favorites.actions';
import { addTrackToFavorites, addAlbumToFavorites } from 'services/imusic-favorites.service';

export function* addTrackToFavoritesRequest(action) {
  const { trackId, albumId } = action.data;
  try {
    const { addImusicToFavorites: responseData } = yield call(
      addTrackToFavorites,
      trackId,
      albumId
    );

    // if request is not successful
    if (responseData.status !== 'success')
      throw new Error('Something went wrong while adding track to favorites');

    yield put(Creators.addTrackToFavoritesSuccess());
  } catch (error) {
    yield put(Creators.addTrackToFavoritesFailure(error.message));
  }
}

export function* addAlbumToFavoritesRequest(action) {
  try {
    const { addAlbumToFavorites: responseData } = yield call(addAlbumToFavorites, action.albumId);

    // if request is not successful
    if (responseData.status !== 'success')
      throw new Error('Something went wrong while adding album to favorites');

    yield put(Creators.addAlbumToFavoritesSuccess());
  } catch (error) {
    yield put(Creators.addAlbumToFavoritesFailure(error.message));
  }
}

export default function* imusicFavoritesSagas() {
  yield takeLatest(Types.ADD_TRACK_TO_FAVORITES, addTrackToFavoritesRequest);
  yield takeLatest(Types.ADD_ALBUM_TO_FAVORITES, addAlbumToFavoritesRequest);
}

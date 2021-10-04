import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/music/music.actions';
import {
  getAlbumDetails,
  getGenres,
  getTracksByAlbum,
  getAlbumsByGenres
} from 'services/music.service';

export function* getGenresRequest() {
  try {
    const { albumGenres } = yield call(getGenres);
    yield put(Creators.getGenresSuccess({ genres: albumGenres }));
  } catch (error) {
    yield put(Creators.getGenresFailure(error.message));
  }
}

export function* getAlbumsRequest(action) {
  const { paginatorInfo, genrePaginator } = action;

  /// genre paginator
  const { page, limit } = genrePaginator;

  const index = (page - 1) * limit;

  let paginator = paginatorInfo.slice(index, limit * page);

  try {
    const response = yield all(
      paginator.map(({ paginator: input }) => call(getAlbumsByGenres, input))
    );

    // // remove items that have 0 content
    const filtered = response.filter(({ albumByGenre }) => albumByGenre.length > 0);
    // console.log({ filtered });
    const albumsByGenre = filtered.map(({ albumByGenre }, index) => {
      return {
        id: paginator[index].id,
        genre: albumByGenre[0].genre,
        albums: albumByGenre
      };
    });

    // console.log({ albumsByGenre });

    /// increment paginator with every successful request
    Object.assign(genrePaginator, { page: page + 1 });

    yield put(Creators.getAlbumsSuccess(albumsByGenre, genrePaginator));
  } catch (error) {
    yield put(Creators.getAlbumsFailure(error.message));
  }
}

export function* getAlbumsByGenresRequest(action) {
  try {
    const { pageNumber } = action.input;

    const nextPaginator = Object.assign(action.input, { pageNumber: pageNumber + 1 });
    const { albumByGenre: albums } = yield call(getAlbumsByGenres, action.input);
    yield put(Creators.getAlbumsByGenresSuccess(albums, nextPaginator));
  } catch (error) {
    yield put(Creators.getAlbumsByGenresFailure(error.message));
  }
}

export function* getAlbumDetailsRequest(action) {
  try {
    /// get album information
    const { album } = yield call(getAlbumDetails, action.albumId);

    // then get tracks
    const { musicsByAlbum: tracks } = yield call(getTracksByAlbum, { albumId: action.albumId });

    // set album and tracks as 1 album object
    yield put(
      Creators.getAlbumDetailsSuccess({
        ...album,
        tracks: tracks.map((track) => ({ ...track, albumId: action.albumId }))
      })
    );
  } catch (error) {
    yield put(Creators.getAlbumDetailsFailure(error.message));
  }
}

export default function* musicSagas() {
  yield takeLatest(Types.GET_ALBUM_DETAILS, getAlbumDetailsRequest);
  yield takeLatest(Types.GET_ALBUMS, getAlbumsRequest);
  yield takeLatest(Types.GET_ALBUMS_BY_GENRES, getAlbumsByGenresRequest);
  yield takeLatest(Types.GET_GENRES, getGenresRequest);
}

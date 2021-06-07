import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/music/music.actions';
import { getGenres, getAlbumsByGenre } from 'services/music.service';

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

  console.log({ paginatorInfo, genrePaginator });

  /// category paginator
  const { page, limit } = genrePaginator;

  const index = (page - 1) * limit;

  let paginator = paginatorInfo.slice(index, limit * page);

  try {
    const albums = yield all(
      paginator.map(({ paginator: input }) => call(getAlbumsByGenre, input))
    );

    console.log({ albums });

    // remove items that have 0 content
    // const filtered = albums.filter(({ albumByGenre }) => albumByGenre.length > 0);

    // const movies = filtered.map(({ albumByGenre }) => {
    //   return { category: albumByGenre[0].category, albums: albumByGenre };
    // });

    // /// increment paginator with every successful request
    // Object.assign(genrePaginator, { page: page + 1 });

    // yield put(Creators.getMoviesSuccess(movies, genrePaginator));
  } catch (error) {
    yield put(Creators.getAlbumsFailure(error.message));
  }
}

export default function* musicSagas() {
  yield takeLatest(Types.GET_ALBUMS, getAlbumsRequest);
  yield takeLatest(Types.GET_GENRES, getGenresRequest);
}

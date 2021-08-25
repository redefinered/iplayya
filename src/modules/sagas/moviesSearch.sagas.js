import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movies-search/moviesSearch.actions';
import { search, getMoviesByCategories } from 'services/movies.service';

export function* searchRequest(action) {
  try {
    const { videos: results } = yield call(search, action.input);
    yield put(Creators.searchSuccess(results));
  } catch (error) {
    yield put(Creators.searchFailure(error.message));
  }
}

export function* getMoviesRequest(action) {
  const { paginatorInfo, categoryPaginator } = action;

  /// category paginator
  const { page, limit } = categoryPaginator;

  const index = (page - 1) * limit;

  let paginator = paginatorInfo.slice(index, limit * page);

  try {
    const videos = yield all(
      paginator.map(({ paginator: input }) => call(getMoviesByCategories, { input }))
    );

    // remove items that have 0 content
    const filtered = videos.filter(({ videoByCategory }) => videoByCategory.length > 0);

    const movies = filtered.map(({ videoByCategory }) => {
      return { category: videoByCategory[0].category, videos: videoByCategory };
    });

    /// increment paginator with every successful request
    Object.assign(categoryPaginator, { page: page + 1 });

    yield put(Creators.getMoviesSuccess(movies, categoryPaginator));
  } catch (error) {
    yield put(Creators.getMoviesFailure(error.message));
  }
}

export default function* moviesSearchSagas() {
  yield takeLatest(Types.SEARCH, searchRequest);
  yield takeLatest(Types.GET_MOVIES, getMoviesRequest);
}

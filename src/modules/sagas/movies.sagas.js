/* eslint-disable prettier/prettier */
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movies/movies.actions';
import { getMoviesByCategories } from 'services/movies.service';

export function* getMoviesRequest(action) {
  const { paginatorInfo } = action;
  try {
    const videos = yield all(
      paginatorInfo.map(({ paginator: input }) => call(getMoviesByCategories, { input }))
    );

    const movies = videos.map(({ videoByCategory }) => {
      return { category: videoByCategory[0].category, videos: videoByCategory };
    });

    yield put(Creators.getMoviesSuccess(movies));
  } catch (error) {
    yield put(Creators.getMoviesFailure(error.message));
  }
}

export function* getMoviesByCategoriesRequest(action) {
  const { input } = action;

  try {
    const { videoByCategory: movies } = yield call(getMoviesByCategories, { input });
    yield put(Creators.getMoviesByCategoriesSuccess(movies));
  } catch (error) {
    yield put(Creators.getMoviesByCategoriesFailure(error.message));
  }
}

export default function* movieSagas() {
  yield takeLatest(Types.GET_MOVIES, getMoviesRequest);
  yield takeLatest(Types.GET_MOVIES_BY_CATEGORIES, getMoviesByCategoriesRequest);
}

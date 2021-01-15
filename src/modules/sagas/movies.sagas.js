/* eslint-disable prettier/prettier */
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movies/movies.actions';
import { getMovie, getMoviesByCategories } from 'services/movies.service';

export function* getMovieRequest(action) {
  const { videoId } = action;
  try {
    const { video: movie } = yield call(getMovie, { videoId });
    yield put(Creators.getMovieSuccess(movie));
  } catch (error) {
    yield put(Creators.getMovieFailure(error.message));
  }
}

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
  yield takeLatest(Types.GET_MOVIE, getMovieRequest);
  yield takeLatest(Types.GET_MOVIES, getMoviesRequest);
  yield takeLatest(Types.GET_MOVIES_BY_CATEGORIES, getMoviesByCategoriesRequest);
}

/* eslint-disable prettier/prettier */
import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movies/movies.actions';
import {
  getMovie,
  getMoviesByCategories,
  addMovieToFavorites,
  getFavoriteMovies
} from 'services/movies.service';

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

    const { favoriteVideos } = yield call(getFavoriteMovies);

    const movies = videos.map(({ videoByCategory }) => {
      return { category: videoByCategory[0].category, videos: videoByCategory };
    });

    // console.log({ favoriteVideos });

    // movies.unshift({ category: 'Favorites', videos: favoriteVideos });

    yield put(Creators.getMoviesSuccess(movies));
    yield put(Creators.getFavoriteMoviesSuccess({ favoriteVideos }));
  } catch (error) {
    yield put(Creators.getMoviesFailure(error.message));
  }
}

export function* getMoviesByCategoriesRequest(action) {
  const {
    input: { pageNumber, limit, categories }
  } = action;

  // increment the pageNumber property of the input in each request
  let nextPageInput = { pageNumber: pageNumber + 1, limit, categories };

  try {
    const { videoByCategory: newMovies } = yield call(getMoviesByCategories, {
      input: nextPageInput
    });
    console.log({ nextPageInput });
    yield put(Creators.getMoviesByCategoriesSuccess({ newMovies, nextPaginator: nextPageInput }));
  } catch (error) {
    yield put(Creators.getMoviesByCategoriesFailure(error.message));
  }
}

export function* addMovieToFavoritesRequest(action) {
  const { videoId } = action;
  try {
    const { addVideoToFavorites } = yield call(addMovieToFavorites, videoId);
    if (!addMovieToFavorites) throw new Error('Failed to add video, something went wrong');
    const { status, message } = addVideoToFavorites;
    if (status !== 'success') throw new Error('Failed to add video, something went wrong');
    console.log({ message });
    yield put(Creators.addMovieToFavoritesSuccess());
  } catch (error) {
    yield put(Creators.addMovieToFavoritesFailure(error.message));
  }
}

export function* getFavoriteMoviesRequest() {
  try {
    const { favoriteVideos } = call(getFavoriteMovies);
    yield put(Creators.getFavoriteMoviesSuccess({ favoriteVideos }));
  } catch (error) {
    yield put(Creators.getFavoriteMoviesFailure(error.message));
  }
}

export default function* movieSagas() {
  yield takeLatest(Types.GET_MOVIE, getMovieRequest);
  yield takeLatest(Types.GET_MOVIES, getMoviesRequest);
  yield takeLatest(Types.GET_MOVIES_BY_CATEGORIES, getMoviesByCategoriesRequest);
  yield takeLatest(Types.ADD_MOVIE_TO_FAVORITES, addMovieToFavoritesRequest);
  yield takeLatest(Types.GET_FAVORITE_MOVIES, getFavoriteMoviesRequest);
}

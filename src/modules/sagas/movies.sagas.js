/* eslint-disable prettier/prettier */
import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movies/movies.actions';
import { getMoviesByCategories } from 'services/movies.service';

// export function* getMoviesRequest(action) {
//   const { categories, paginatorInfo } = action.data;
//   try {
//     // collection is an array of objects with category and content prop
//     let colletion = [];
//     const { videoByCategory}
//   } catch (error) {

//   }
// }

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
  // yield takeLatest(Types.GET_MOVIES, getMoviesRequest);
  yield takeLatest(Types.GET_MOVIES_BY_CATEGORIES, getMoviesByCategoriesRequest);
}

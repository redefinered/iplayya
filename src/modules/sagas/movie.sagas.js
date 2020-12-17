/* eslint-disable prettier/prettier */
import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movie/movie.actions';
import { getMovies as getSomeMovies } from 'services/movie.service';

export function* getMovies(action) {
  let { limit, pageNumber } = action.data;

  // this will be called on first request as limit and pageNumber is undefined
  limit = limit || 10;
  pageNumber = pageNumber || 1;

  try {
    const { videos: movies } = yield call(getSomeMovies, { limit, pageNumber });
    console.log({ movies });
    yield put(Creators.getMoviesSuccess({ movies }));
  } catch (error) {
    yield put(Creators.getMoviesFailure(error.message));
  }
}

export default function* movieSagas() {
  // yield takeLatest(Types.GET_ONE, getOneRequest);
  yield takeLatest(Types.GET_MOVIES, getMovies);
}

import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movies/movies.actions';
import { getMovies } from 'services/movies.service';

export function* getMoviesRequest(action) {
  const { first, page } = action.data;
  try {
    const { movies } = yield call(getMovies, first, page);
    console.log({ movies });
    yield put(Creators.getMoviesSuccess({ movies }));
  } catch (error) {
    yield put(Creators.getMoviesFailure(error.message));
  }
}

export default function* moviesSagas() {
  yield takeLatest(Types.GET_MOVIES, getMoviesRequest);
}

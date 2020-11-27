/* eslint-disable prettier/prettier */
import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/movie/movie.actions';
import { getOne, get } from 'services/movie.service';

// export function* getOneRequest(action) {
//   let { first, page } = action.data;

//   try {
//     const { movie } = yield call(getOne, first, page);
//     yield put(Creators.getOneSuccess({ movie }));
//   } catch (error) {
//     yield put(Creators.getOneFailure(error.message));
//   }
// }

export function* getRequest(action) {
  let { limit, pageNumber } = action.data;

  // this will be called on first request as limit and pageNumber is undefined
  limit = limit || 10;
  pageNumber = pageNumber || 1;

  try {
    const { videos: movies } = yield call(get, { limit, pageNumber });
    console.log({ movies });
    yield put(Creators.getSuccess({ movies }));
  } catch (error) {
    yield put(Creators.getFailure(error.message));
  }
}

export default function* movieSagas() {
  // yield takeLatest(Types.GET_ONE, getOneRequest);
  yield takeLatest(Types.GET, getRequest);
}

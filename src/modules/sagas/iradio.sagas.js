import { call, put, takeLatest } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/iradio/iradio.actions';
import { getStations, search } from 'services/iradio.service';

// export function* getRequest(action) {
//   const { input } = action;

//   try {
//     // TODO: input should come from stat, pageNumber should be incremented for every request
//     const { radios: radioStations } = yield call(getStations, input);

//     // add a pn field to each radio station object for refetching when added to favorites
//     const newData = radioStations.map((rs) => ({ ...rs, pn: input.pageNumber }));

//     /// increment pageNumber each successful request
//     const nextPaginator = Object.assign(input, { pageNumber: input.pageNumber + 1 });

//     yield put(Creators.getSuccess(newData, nextPaginator));
//   } catch (error) {
//     yield put(Creators.getFailure(error.message));
//   }
// }

export function* getRequest(action) {
  const { limit, pageNumber } = action.input;

  /// increment pageNumber each successful request
  const nextPaginatorInfo = { limit, pageNumber: pageNumber + 1 };

  try {
    const { radios } = yield call(getStations, action.input);
    yield put(
      Creators.getSuccess(
        radios.map((i) => ({ ...i, c: 'all' })),
        nextPaginatorInfo
      )
    );
  } catch (error) {
    yield put(Creators.getFailure(error.message));
  }
}

export function* searchRequest(action) {
  const { limit, pageNumber } = action.input;
  const { shouldIncrement } = action;

  try {
    const { radios: results } = yield call(search, action.input);

    /// increment pageNumber each successful request
    const nextPaginatorInfo = { limit, pageNumber: shouldIncrement ? pageNumber + 1 : pageNumber };

    // console.log({ loc: 'saga', ...nextPaginatorInfo });
    yield put(Creators.searchSuccess(results, nextPaginatorInfo));
  } catch (error) {
    yield put(Creators.searchFailure(error.message));
  }
}

export default function* radiosSagas() {
  yield takeLatest(Types.GET, getRequest);
  yield takeLatest(Types.SEARCH, searchRequest);
}

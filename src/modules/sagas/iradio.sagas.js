import { call, put, takeLatest } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/iradio/iradio.actions';
import { getStations } from 'services/iradio.service';

export function* getRequest(action) {
  const { input } = action;

  try {
    // TODO: input should come from stat, pageNumber should be incremented for every request
    const { radios: radioStations } = yield call(getStations, input);

    // add a pn field to each radio station object for refetching when added to favorites
    const newData = radioStations.map((rs) => ({ ...rs, pn: input.pageNumber }));

    /// increment pageNumber each successful request
    const nextPaginator = Object.assign(input, { pageNumber: input.pageNumber + 1 });

    yield put(Creators.getSuccess(newData, nextPaginator));
  } catch (error) {
    yield put(Creators.getFailure(error.message));
  }
}

export default function* radiosSagas() {
  yield takeLatest(Types.GET, getRequest);
}

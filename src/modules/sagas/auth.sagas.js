import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/auth/auth.actions';

import { hello } from 'services/auth.service';

export function* helloTestSaga(action) {
  const { name } = action.data;
  try {
    const { name: helloName } = yield call(hello, name);
    yield put(Creators.helloSuccess({ name: helloName }));
  } catch (error) {
    yield put(Creators.helloSuccess(error.message));
  }
}

export default function* authSagas() {
  yield takeLatest(Types.HELLO, helloTestSaga);
}

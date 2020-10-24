import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/auth/auth.actions';
import { signIn } from 'services/auth.service';

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

export function* signInRequest() {
  try {
    const currentUser = yield call(signIn);
    yield put(Creators.signInSuccess({ currentUser }));
  } catch (error) {
    yield put(Creators.signInFailure(error.message));
  }
}

export function* signOutRequest() {
  yield put(Creators.purgeStore());
}

export default function* authSagas() {
  yield takeLatest(Types.HELLO, helloTestSaga);
  yield takeLatest(Types.SIGN_IN, signInRequest);
  yield takeLatest(Types.SIGN_OUT, signOutRequest);
}

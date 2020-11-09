import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/password/password.actions';
import { getLink, update } from 'services/password.service';

export function* getLinkRequest(action) {
  const { ...input } = action.data;
  try {
    const { forgotPassword } = yield call(getLink, input);
    yield put(Creators.getLinkSuccess({ forgotPassword }));
  } catch (error) {
    yield put(Creators.getLinkFailure(error.message));
  }
}

export function* updateRequest(action) {
  const { ...input } = action.data;
  try {
    const { updateForgottenPassword } = yield call(update, input);
    yield put(Creators.updateSuccess({ updateForgottenPassword }));
  } catch (error) {
    yield put(Creators.updateFailure(error.message));
  }
}

export default function* passwordSagas() {
  yield takeLatest(Types.GET_LINK, getLinkRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
}

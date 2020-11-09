import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/password/password.actions';
import { getLink, update } from 'services/password.service';

export function* getLinkRequest(action) {
  const { ...input } = action.data;
  try {
    const {
      forgotPassword: { status, message }
    } = yield call(getLink, input);
    yield put(Creators.getPasswordResetLinkSuccess({ pwResetLinkMessage: { status, message } }));
  } catch (error) {
    yield put(Creators.getPasswordResetLinkFailure(error.message));
  }
}

export function* updateRequest(action) {
  const { ...input } = action.data;
  try {
    const { updateForgottenPassword } = yield call(update, input);
    yield put(Creators.resetPasswordSuccess({ updateForgottenPassword }));
  } catch (error) {
    yield put(Creators.resetPasswordFailure(error.message));
  }
}

export default function* passwordSagas() {
  yield takeLatest(Types.GET_LINK, getLinkRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
}

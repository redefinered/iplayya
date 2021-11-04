import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/profile/profile.actions';
import { get as getProfile, update as updateProfile } from 'services/profile.service';
import { signIn } from 'services/auth.service';

export function* getRequest() {
  try {
    const { me: profile } = yield call(getProfile);

    yield put(Creators.getSuccess(profile));
  } catch (error) {
    yield put(Creators.getFailure(error.message));
  }
}

export function* updateRequest(action) {
  const { ...input } = action.data;
  // console.log({ input });
  try {
    const { updateUserProfile } = yield call(updateProfile, input);
    yield put(Creators.updateSuccess({ updateResponse: updateUserProfile }));
  } catch (error) {
    yield put(Creators.updateFailure(error.message));
  }
}

export function* authenticateEmailChangeRequest(action) {
  const { username, password } = action.data;
  try {
    const response = yield call(signIn, username, password);
    console.log('response', response);
    yield put(Creators.authenticateEmailChangeSuccess());
  } catch (error) {
    console.log(error);
    yield put(Creators.authenticateEmailChangeFailure(error.message));
  }
}

export default function* profileSagas() {
  yield takeLatest(Types.GET, getRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
  yield takeLatest(Types.AUTHENTICATE_EMAIL_CHANGE, authenticateEmailChangeRequest);
}

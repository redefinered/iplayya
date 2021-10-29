import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/profile/profile.actions';
import { get as getProfile, update as updateProfile } from 'services/profile.service';

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

export default function* profileSagas() {
  yield takeLatest(Types.GET, getRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
}

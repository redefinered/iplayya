import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/profile/profile.actions';
import { getProfile } from 'services/profile.service';

export function* getProfileRequest() {
  try {
    const { me } = yield call(getProfile);
    yield put(Creators.getProfileSuccess({ currentUser: me }));
  } catch (error) {
    yield put(Creators.getProfileFailure(error.message));
  }
}

export default function* profileSagas() {
  yield takeLatest(Types.GET_PROFILE, getProfileRequest);
}

import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { signIn, getProfile, signOut } from 'services/auth/auth.service';

import AsyncStorage from '@react-native-community/async-storage';

export function* signInRequest(action) {
  const { username, password } = action.data;
  try {
    const {
      login: { access_token }
    } = yield call(signIn, username, password);
    yield AsyncStorage.setItem('access_token', access_token);
    // const currentUser = yield call(signIn);
    yield put(Creators.signInSuccess());
  } catch (error) {
    yield put(Creators.signInFailure(error.message));
  }
}

export function* signOutRequest() {
  try {
    yield call(signOut);
    yield put(Creators.purgeStore());
    yield AsyncStorage.removeItem('access_token');
    yield put(Creators.signOutSuccess());
    yield put(ProfileCreators.removeCurrentUser());
  } catch (error) {
    yield put(Creators.signOutFailure(`Sign-out error: ${error.message}`));
  }
}

export function* getProfileRequest() {
  try {
    const { me } = yield call(getProfile);
    yield put(Creators.getProfileSuccess({ currentUser: me }));
  } catch (error) {
    yield put(Creators.getProfileFailure(error.message));
  }
}

export default function* authSagas() {
  yield takeLatest(Types.SIGN_IN, signInRequest);
  yield takeLatest(Types.GET_PROFILE, getProfileRequest);
  yield takeLatest(Types.SIGN_OUT, signOutRequest);
}

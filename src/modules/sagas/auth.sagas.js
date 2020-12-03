import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/auth/auth.actions';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { register, signIn, getProfile, signOut } from 'services/auth.service';

import AsyncStorage from '@react-native-community/async-storage';

export function* registerRequest(action) {
  const { ...input } = action.data;
  try {
    const {
      register: {
        status,
        tokens: { access_token }
      }
    } = yield call(register, input);

    // not sure if this is necessary
    if (status !== 'SUCCESS') throw new Error('Something went wrong during registration process');

    yield AsyncStorage.setItem('access_token', access_token);
    yield put(Creators.registerSuccess());
  } catch (error) {
    yield put(Creators.registerFailure(error.message));
  }
}
export function* signInRequest(action) {
  const { username, password } = action.data;
  try {
    const {
      login: { access_token, user }
    } = yield call(signIn, username, password);
    yield AsyncStorage.setItem('access_token', access_token);
    // const currentUser = yield call(signIn);
    yield put(Creators.signInSuccess());
    yield put(UserCreators.setCurrentUser({ user }));
  } catch (error) {
    yield put(Creators.signInFailure(error.message));
  }
}

export function* signOutRequest() {
  try {
    yield call(signOut);
    yield put(Creators.reset());
    yield AsyncStorage.removeItem('access_token');
    yield put(Creators.signOutSuccess());
    yield put(UserCreators.removeCurrentUser());
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

export function* signInStartRequest() {
  yield AsyncStorage.removeItem('access_token');
}

export default function* authSagas() {
  yield takeLatest(Types.REGISTER, registerRequest);
  yield takeLatest(Types.SIGN_IN_START, signInStartRequest);
  yield takeLatest(Types.SIGN_IN, signInRequest);
  yield takeLatest(Types.GET_PROFILE, getProfileRequest);
  yield takeLatest(Types.SIGN_OUT, signOutRequest);
}

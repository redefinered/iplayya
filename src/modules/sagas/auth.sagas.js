/* eslint-disable no-unused-vars */

import { takeLatest, put, call } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import { Types, Creators } from 'modules/ducks/auth/auth.actions';

import { Creators as AppCreators } from 'modules/app';
import { Creators as UserCreators } from 'modules/ducks/user/user.actions';
import { Creators as ProfileCreators } from 'modules/ducks/profile/profile.actions';
import { Creators as ItvCreators } from 'modules/ducks/itv/itv.actions';
import { Creators as MoviesCreators } from 'modules/ducks/movies/movies.actions';
import { Creators as IsportsCreators } from 'modules/ducks/isports/isports.actions';
import { Creators as MusicCreators } from 'modules/ducks/music/music.actions';

import { register, signIn, signOut } from 'services/auth.service';
import { getCategories } from 'services/movies.service';
import { get as getProfile } from 'services/profile.service';
import { getGenres } from 'services/itv.service';
import { getGenres as getMusicGenres } from 'services/music.service';

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

    const { me: user } = yield call(getProfile);

    // reset state data
    yield put(ItvCreators.reset());
    yield put(MoviesCreators.reset());
    yield put(MusicCreators.reset());

    // yield put(Creators.signInSuccess());
    yield put(Creators.signInSuccess(user, true));
    // yield put(ProfileCreators.getSuccess(user));

    yield put(UserCreators.userStart());

    // removes the loader at the root level
    yield put(AppCreators.appReadySuccess());
  } catch (error) {
    yield put(Creators.registerFailure(error.message));
  }
}

export function* signInRequest(action) {
  const { username, password } = action.data;
  try {
    yield put(AppCreators.appReady());
    const {
      login: { access_token }
    } = yield call(signIn, username, password);

    // save access token to local storage for graphql client
    yield AsyncStorage.setItem('access_token', access_token);

    const { me: user } = yield call(getProfile);

    console.log({ user });

    // reset state data
    yield put(ItvCreators.reset());
    yield put(MoviesCreators.reset());
    yield put(IsportsCreators.reset());
    yield put(MusicCreators.reset());

    // yield put(Creators.signInSuccess());
    yield put(Creators.signInSuccess(user));
    // yield put(ProfileCreators.getSuccess(user));

    yield put(AppCreators.appReadySuccess());
  } catch (error) {
    console.log({ error });
    yield put(Creators.signInFailure(error.message));
  }
}

export function* signOutRequest() {
  try {
    yield call(signOut);
    yield put(Creators.reset());

    // remove access token
    yield AsyncStorage.removeItem('access_token');

    // check token
    // const token = yield AsyncStorage.getItem('access_token');
    // console.log({ token });

    yield put(Creators.signOutSuccess());

    // remove current user and profile
    // yield put(UserCreators.removeCurrentUser());
    yield put(ProfileCreators.removeProfile());

    // clear user specific settings
    // yield put(UserCreators.reset());
  } catch (error) {
    yield put(Creators.signOutFailure(`Sign-out error: ${error.message}`));
  }
}

export function* signInStartRequest() {
  yield AsyncStorage.removeItem('access_token');
}

export default function* authSagas() {
  yield takeLatest(Types.REGISTER, registerRequest);
  yield takeLatest(Types.SIGN_IN_START, signInStartRequest);
  yield takeLatest(Types.SIGN_IN, signInRequest);
  yield takeLatest(Types.SIGN_OUT, signOutRequest);
}

import { all, fork } from 'redux-saga/effects';
import authSagas from './auth.sagas';
import userSagas from './user.sagas';
import passwordSagas from './password.sagas';
import profileSagas from './profile.sagas';
import providerSagas from './provider.sagas';
import movieSagas from './movie.sagas';

export default function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(userSagas),
    fork(passwordSagas),
    fork(movieSagas),
    fork(profileSagas),
    fork(providerSagas)
  ]);
}

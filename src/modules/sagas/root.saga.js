import { all, fork } from 'redux-saga/effects';
import authSagas from './auth.sagas';
import passwordSagas from './password.sagas';
import profileSagas from './profile.sagas';
import providerSagas from './provider.sagas';
import moviesSagas from './movies.sagas';

export default function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(passwordSagas),
    fork(moviesSagas),
    fork(profileSagas),
    fork(providerSagas)
  ]);
}

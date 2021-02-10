import { all, fork } from 'redux-saga/effects';
import authSagas from './auth.sagas';
import itvSagas from './itv.sagas';
import userSagas from './user.sagas';
import passwordSagas from './password.sagas';
import profileSagas from './profile.sagas';
import providerSagas from './provider.sagas';
import moviesSagas from './movies.sagas';
import radiosSagas from './radios.sagas';

export default function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(itvSagas),
    fork(userSagas),
    fork(passwordSagas),
    fork(moviesSagas),
    fork(radiosSagas),
    fork(profileSagas),
    fork(providerSagas)
  ]);
}

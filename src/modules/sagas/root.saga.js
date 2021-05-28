import { all, fork } from 'redux-saga/effects';
import authSagas from './auth.sagas';
import downloadsSagas from './downloads.sagas';
import itvSagas from './itv.sagas';
import userSagas from './user.sagas';
import passwordSagas from './password.sagas';
import profileSagas from './profile.sagas';
import providerSagas from './provider.sagas';
import moviesSagas from './movies.sagas';
import isportsSagas from './isports.sagas';
import iradioSagas from './iradio.sagas';

export default function* rootSaga() {
  yield all([
    fork(authSagas),
    fork(downloadsSagas),
    fork(itvSagas),
    fork(userSagas),
    fork(passwordSagas),
    fork(moviesSagas),
    fork(isportsSagas),
    fork(iradioSagas),
    fork(profileSagas),
    fork(providerSagas)
  ]);
}

import { all, fork } from 'redux-saga/effects';
import appSagas from './app.sagas';
import authSagas from './auth.sagas';
import itvSagas from './itv.sagas';
import userSagas from './user.sagas';
import passwordSagas from './password.sagas';
import profileSagas from './profile.sagas';
import providerSagas from './provider.sagas';
import moviesSagas from './movies.sagas';
import musicSagas from './music.sagas';
import imusicFavoritesSagas from './imusic-favorites.sagas';
import isportsSagas from './isports.sagas';
import iradioSagas from './iradio.sagas';
import iradioFavoritesSagas from './iradio-favorites.sagas';

export default function* rootSaga() {
  yield all([
    fork(appSagas),
    fork(authSagas),
    fork(itvSagas),
    fork(userSagas),
    fork(passwordSagas),
    fork(moviesSagas),
    fork(musicSagas),
    fork(imusicFavoritesSagas),
    fork(isportsSagas),
    fork(iradioSagas),
    fork(iradioFavoritesSagas),
    fork(profileSagas),
    fork(providerSagas)
  ]);
}

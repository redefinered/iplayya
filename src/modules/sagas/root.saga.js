import { all, fork } from 'redux-saga/effects';
import authSagas from './auth.sagas';
import profileSagas from './profile.sagas';
import moviesSagas from './movies.sagas';

export default function* rootSaga() {
  yield all([fork(authSagas), fork(moviesSagas), fork(profileSagas)]);
}

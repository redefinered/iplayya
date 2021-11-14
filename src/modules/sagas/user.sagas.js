import { takeLatest, call, put } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/user/user.actions';
import { updatePlaybackSettings } from 'services/user.service';

export function* updateProfileSettingsRequest(action) {
  const { input } = action.data;
  try {
    const { updatePlaybackSetting } = yield call(updatePlaybackSettings, input);
    console.log({ updatePlaybackSetting });
    yield put(Creators.updatePlaybackSettingsSuccess());
  } catch (error) {
    yield put(Creators.updatePlaybackSettingsFailure(error.message));
  }
}

export default function* userSagas() {
  yield takeLatest(Types.UPDATE_PLAYBACK_SETTINGS, updateProfileSettingsRequest);
}

import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { resettableReducer } from 'reduxsauce';

import appReducer from './app';
import navReducer from './ducks/nav/nav.reducer';
import authReducer from './ducks/auth/auth.reducer';
import downloadsReducer from './ducks/downloads/downloads.reducer';
import userReducer from './ducks/user/user.reducer';
import passwordReducer from './ducks/password/password.reducer';
import itvReducer from './ducks/itv/itv.reducer';
import notificationsReducer from './ducks/notifications/notifications.reducer';
import profileReducer from './ducks/profile/profile.reducer';
import moviesReducer from './ducks/movies/movies.reducer';
import musicReducer from './ducks/music/music.reducer';
import isportsReducer from './ducks/isports/isports.reducer';
import iradioReducer from './ducks/iradio/iradio.reducer';
import providerReducer from './ducks/provider/provider.reducer';
import iplayReducer from './ducks/iplay/iplay.reducer';

export const persistConfig = {
  key: 'primary',
  storage: AsyncStorage
};

const resettable = resettableReducer('RESET');

const rootReducer = persistCombineReducers(persistConfig, {
  app: appReducer,
  auth: authReducer,
  // auth: resettable(authReducer),
  nav: navReducer,
  downloads: downloadsReducer,
  user: resettable(userReducer),
  password: resettable(passwordReducer),
  itv: resettable(itvReducer),
  notifications: resettable(notificationsReducer),
  profile: profileReducer,
  movies: resettable(moviesReducer),
  music: resettable(musicReducer),
  sports: resettable(isportsReducer),
  radios: iradioReducer,
  provider: providerReducer,
  iplay: iplayReducer
});

export default (state, action) => {
  if (action.type === '@App/PURGE_STORE') {
    console.log('store purged!');
    AsyncStorage.removeItem('persist:primary');
    AsyncStorage.removeItem('access_token');
    state = undefined;
  }

  return rootReducer(state, action);
};

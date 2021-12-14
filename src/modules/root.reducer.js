import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { resettableReducer } from 'reduxsauce';

import appReducer from './app';
import navReducer from './ducks/nav/nav.reducer';
import authReducer from './ducks/auth/auth.reducer';
import imovieDownloadsReducer from './ducks/imovie-downloads/imovie-downloads.reducer';
import userReducer from './ducks/user/user.reducer';
import passwordReducer from './ducks/password/password.reducer';
import itvReducer from './ducks/itv/itv.reducer';
import notificationsReducer from './ducks/notifications/notifications.reducer';
import profileReducer from './ducks/profile/profile.reducer';
import moviesReducer from './ducks/movies/movies.reducer';
import musicReducer from './ducks/music/music.reducer';
import imusicFavoritesReducer from './ducks/imusic-favorites/imusic-favorites.reducer';
import imusicSearchReducer from './ducks/imusic-search/imusic-search.reducer';
import imusicDownloadsReducer from './ducks/imusic-downloads/imusic-downloads.reducer';
import isportsReducer from './ducks/isports/isports.reducer';
import iradioReducer from './ducks/iradio/iradio.reducer';
import iradioFavoritesRaducer from './ducks/iradio-favorites/iradio-favorites.reducer';
import providerReducer from './ducks/provider/provider.reducer';
import iplayReducer from './ducks/iplay/iplay.reducer';

export const persistConfig = {
  key: 'primary',
  storage: AsyncStorage
  // blacklist: ['notifications']
};

// eslint-disable-next-line no-unused-vars
const resettable = resettableReducer('RESET'); /// maybe only remove this in production mode

const rootReducer = persistCombineReducers(persistConfig, {
  app: appReducer,
  auth: authReducer,
  nav: navReducer,
  imovieDownloads: imovieDownloadsReducer,
  user: userReducer,
  password: passwordReducer,
  itv: itvReducer,
  notifications: notificationsReducer,
  profile: profileReducer,
  movies: moviesReducer,
  music: musicReducer,
  imusicFavorites: imusicFavoritesReducer,
  imusicSearch: imusicSearchReducer,
  imusicDownloads: imusicDownloadsReducer,
  sports: isportsReducer,
  radios: iradioReducer,
  iradioFavorites: iradioFavoritesRaducer,
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

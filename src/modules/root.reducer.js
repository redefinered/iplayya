import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import navReducer from './ducks/nav/nav.reducer';
import authReducer from './ducks/auth/auth.reducer';
import passwordReducer from './ducks/password/password.reducer';
import profileReducer from './ducks/profile/profile.reducer';
import iptvReducer from './ducks/iptv/iptv.reducer';
import moviesReducer from './ducks/movies/movies.reducer';

export const persistConfig = {
  key: 'primary',
  storage: AsyncStorage
};

const rootReducer = persistCombineReducers(persistConfig, {
  nav: navReducer,
  auth: authReducer,
  password: passwordReducer,
  iptv: iptvReducer,
  profile: profileReducer,
  movies: moviesReducer
});

export default (state, action) => {
  if (action.type === '@Auth/PURGE_STORE') {
    console.log('store purged!');
    AsyncStorage.removeItem('persist:primary');
    state = undefined;
  }

  return rootReducer(state, action);
};

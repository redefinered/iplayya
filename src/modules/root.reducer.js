import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import navReducer from './ducks/nav/nav.reducer';
import authReducer from './ducks/auth/auth.reducer';
import userReducer from './ducks/user/user.reducer';
import passwordReducer from './ducks/password/password.reducer';
import itvReducer from './ducks/itv/itv.reducer';
import profileReducer from './ducks/profile/profile.reducer';
import moviesReducer from './ducks/movies/movies.reducer';
import radiosReducer from './ducks/radios/radios.reducer';
import providerReducer from './ducks/provider/provider.reducer';

export const persistConfig = {
  key: 'primary',
  storage: AsyncStorage
};

const rootReducer = persistCombineReducers(persistConfig, {
  nav: navReducer,
  auth: authReducer,
  user: userReducer,
  password: passwordReducer,
  itv: itvReducer,
  profile: profileReducer,
  movies: moviesReducer,
  radios: radiosReducer,
  provider: providerReducer
});

export default (state, action) => {
  if (action.type === '@Auth/PURGE_STORE') {
    console.log('store purged!');
    AsyncStorage.removeItem('persist:primary');
    AsyncStorage.removeItem('access_token');
    state = undefined;
  }

  return rootReducer(state, action);
};

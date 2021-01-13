import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import navReducer from './ducks/nav/nav.reducer';
import authReducer from './ducks/auth/auth.reducer';
import userReducer from './ducks/user/user.reducer';
import passwordReducer from './ducks/password/password.reducer';
import profileReducer from './ducks/profile/profile.reducer';
import moviesReducer from './ducks/movies/movies.reducer';
import radioReducer from './ducks/radio/radio.reducer';
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
  profile: profileReducer,
  movies: moviesReducer,
  radio: radioReducer,
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

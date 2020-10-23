import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import navReducer from './ducks/nav/nav.reducer';
import authReducer from './ducks/auth/auth.reducer';
import iptvReducer from './ducks/iptv/iptv.reducer';

export const persistConfig = {
  key: 'primary',
  storage: AsyncStorage
};

const rootReducer = persistCombineReducers(persistConfig, {
  nav: navReducer,
  auth: authReducer,
  iptv: iptvReducer
});

export default (state, action) => {
  if (action.type === 'PURGE_STORE') {
    console.log('store purged!');
    AsyncStorage.removeItem('persist:primary');
    state = undefined;
  }

  return rootReducer(state, action);
};

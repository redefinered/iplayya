import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import authReducer from './ducks/auth/auth.reducer';

export const persistConfig = {
  key: 'primary',
  storage: AsyncStorage
};

const rootReducer = persistCombineReducers(persistConfig, {
  auth: authReducer
});

export default (state, action) => {
  if (action.type === 'PURGE_STORE') {
    console.log('store purged!');
    AsyncStorage.removeItem('persist:primary');
    state = undefined;
  }

  return rootReducer(state, action);
};

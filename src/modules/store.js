/* eslint-disable no-undef */

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { persistConfig } from './root.reducer';
import rootSaga from 'modules/sagas/root.saga';

const logger = createLogger({
  collapsed: true,
  predicate: (_, action) =>
    action.type !== '@Movies/UPDATE_PLAYBACK_INFO' &&
    action.type !== '@Music/UPDATE_PLAYBACK_INFO' &&
    action.type !== '@Nav/SET_BOTTOM_TABS_VISIBLE' &&
    action.type !== '@Music/SET_PROGRESS'
});

const sagaMiddleware = createSagaMiddleware();

/// in react web apps logger can be added on development only
// react native works differently, we cannot check NODE_ENV as opposed to web so we add logger here
// but we added babel-plugin-transform-remove-console to remove consoles in production
// the reason we do that is because logs in production can cause performance issues
const middlewares = [sagaMiddleware, logger]; // makes middlewares scalable

// add Redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

export const resetStore = () => store.dispatch({ type: 'RESET' });

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export default () => {
  if (module.hot) {
    module.hot.accept('./root.reducer', () => {
      // This fetch the new state of the above reducers.
      const nextRootReducer = require('./root.reducer').default;
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer));
    });
  }

  return { store, persistor };
};

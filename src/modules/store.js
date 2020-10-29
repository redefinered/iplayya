/* eslint-disable no-undef */

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer, { persistConfig } from './root.reducer';

import rootSaga from 'modules/sagas/root.saga';

const logger = createLogger({ collapsed: true });

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware]; // makes middlewares scalable

if (process.env.NODE_ENV === 'development') {
  // add redux-logger as middleware on development
  middlewares.push(logger);
}

// add Redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

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

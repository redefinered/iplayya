import { takeLatest, put, call, all } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/provider/provider.actions';
import { Creators as AppCreators } from 'modules/app';
import {
  create as createProvider,
  update as updateProvider,
  deleteOne as deleteProvider
} from 'services/provider.service';

export function* createRequest(action) {
  const { input } = action.data;
  try {
    const { createUserProvider } = yield call(createProvider, input);

    yield put(AppCreators.setProvider(createUserProvider.id));

    yield put(Creators.createSuccess({ createUserProvider }));
  } catch (error) {
    yield put(Creators.createFailure(error.message));
  }
}

export function* updateRequest(action) {
  const { input: args } = action.data;
  try {
    const { updateUserProvider } = yield call(updateProvider, args);
    console.log({ updateUserProvider });
    yield put(Creators.updateSuccess());
  } catch (error) {
    yield put(Creators.updateFailure(error.message));
  }
}

export function* deleteRequest(action) {
  const { ids } = action.data;
  try {
    yield all(ids.map((i) => call(deleteProvider, i)));
    yield put(Creators.deleteSuccess());
  } catch (error) {
    yield put(Creators.deleteFailure(error.message));
  }
}

export default function* providerSagas() {
  yield takeLatest(Types.CREATE, createRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
  yield takeLatest(Types.DELETE, deleteRequest);
}

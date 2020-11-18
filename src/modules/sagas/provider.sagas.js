import { takeLatest, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'modules/ducks/provider/provider.actions';
import { create as createProvider, deleteOne as deleteProvider } from 'services/provider.service';

export function* createRequest(action) {
  const { input } = action.data;
  try {
    const { createUserProvider } = yield call(createProvider, input);
    console.log({ createUserProvider });
    yield put(Creators.createSuccess({ createUserProvider }));
  } catch (error) {
    yield put(Creators.createFailure(error.message));
  }
}

export function* updateRequest() {
  yield console.log('update request here');
}

export function* deleteRequest(action) {
  const { id } = action.data;
  try {
    const { deleteUserProvider } = yield call(deleteProvider, id);
    console.log({ deleteUserProvider });
    yield put(Creators.deleteSuccess());
  } catch (error) {
    yield put(Creators.deleteFailure(error.message));
  }
}

export default function* providerSagas() {
  // yield takeLatest(Types.GET, getRequest);
  yield takeLatest(Types.CREATE, createRequest);
  yield takeLatest(Types.UPDATE, updateRequest);
  yield takeLatest(Types.DELETE, deleteRequest);
}

import { all, fork } from 'redux-saga/effects'

import { authenticationWatcherSaga } from 'features/authentication/store/sagas'

export function* rootSaga() {
  yield all([fork(authenticationWatcherSaga)])
}

export default rootSaga

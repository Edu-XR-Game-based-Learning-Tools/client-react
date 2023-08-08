import { all, fork } from 'redux-saga/effects'

import { authenticationWatcherSaga } from 'features/authentication/store/sagas'
import { quizArchiveWatcherSaga } from 'features/quizArchive/store/sagas'

export function* rootSaga() {
  yield all([fork(authenticationWatcherSaga)])
  yield all([fork(quizArchiveWatcherSaga)])
}

export default rootSaga

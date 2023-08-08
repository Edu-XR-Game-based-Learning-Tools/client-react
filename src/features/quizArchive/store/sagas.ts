import { SagaIterator } from '@redux-saga/core'
import { toast } from 'react-toastify'
import { call, put, takeEvery } from 'redux-saga/effects'

import * as globalStore from 'features/global/store'

import { deleteQuizCollection, getQuizCollection, getQuizCollectionList, updateQuizCollection } from '../services'
import { QuizCollectionDto, QuizCollectionListDto, initQuizCollectionDto } from '../types'

import { quizArchiveActions } from './slice'

// Worker Sagas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* onGetQuizCollectionList(_: {
  type: typeof quizArchiveActions.getQuizCollectionList
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizCollectionListDto = yield call(getQuizCollectionList)
    if (res.success) {
      yield put(quizArchiveActions.setQuizCollectionList(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onGetQuizCollection({
  payload,
}: {
  type: typeof quizArchiveActions.getQuizCollection
  payload: number
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizCollectionDto = yield call(getQuizCollection, payload)
    if (res.success) {
      yield put(quizArchiveActions.setEditCollection(res))
    } else {
      toast.error(res.message)
      yield put(quizArchiveActions.setEditCollection(initQuizCollectionDto))
    }
  } catch (error) {
    toast.error(error)
    yield put(quizArchiveActions.setEditCollection(initQuizCollectionDto))
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onUpdateQuizCollection({
  payload,
}: {
  type: typeof quizArchiveActions.updateQuizCollection
  payload: QuizCollectionDto
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const isAdd = payload.eId == null
    const res: QuizCollectionDto = yield call(updateQuizCollection, payload)
    if (res.success) {
      if (isAdd)
        yield put(quizArchiveActions.setAddCollection(res))
      else
        yield put(quizArchiveActions.setEditCollection(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onDeleteQuizCollection({
  payload,
}: {
  type: typeof quizArchiveActions.deleteQuizCollection
  payload: QuizCollectionDto
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizCollectionDto = yield call(deleteQuizCollection, payload)
    if (res.success) {
      yield put(quizArchiveActions.setEditCollection(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

// Watcher Saga
export function* quizArchiveWatcherSaga(): SagaIterator {
  yield takeEvery(quizArchiveActions.getQuizCollectionList.type, onGetQuizCollectionList)
  yield takeEvery(quizArchiveActions.getQuizCollection.type, onGetQuizCollection)
  yield takeEvery(quizArchiveActions.updateQuizCollection.type, onUpdateQuizCollection)
  yield takeEvery(quizArchiveActions.deleteQuizCollection.type, onDeleteQuizCollection)
}

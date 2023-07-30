import { SagaIterator } from '@redux-saga/core'
import { toast } from 'react-toastify'
import { call, put, takeEvery } from 'redux-saga/effects'

import * as globalStore from 'features/global/store'

import { deleteQuiz, getQuiz, getQuizList, updateQuiz } from '../services'
import { QuizList, QuizData } from '../types'

import { quizArchiveActions } from './slice'

// Worker Sagas
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* onGetQuizList(_: {
  type: typeof quizArchiveActions.getQuizList
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizList = yield call(getQuizList)
    if (res.success) {
      yield put(quizArchiveActions.setQuizList(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onGetQuiz({
  payload,
}: {
  type: typeof quizArchiveActions.getQuiz
  payload: number
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizData = yield call(getQuiz, payload)
    if (res.success) {
      yield put(quizArchiveActions.setEditQuiz(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onUpdateQuiz({
  payload,
}: {
  type: typeof quizArchiveActions.updateQuiz
  payload: QuizData
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizData = yield call(updateQuiz, payload)
    if (res.success) {
      yield put(quizArchiveActions.setEditQuiz(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onDeleteQuiz({
  payload,
}: {
  type: typeof quizArchiveActions.deleteQuiz
  payload: QuizData
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: QuizList = yield call(deleteQuiz, payload)
    if (res.success) {
      yield put(quizArchiveActions.setQuizList(res))
    } else {
      toast.error(res.message)
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

// Watcher Saga
export function* authenticationWatcherSaga(): SagaIterator {
  yield takeEvery(quizArchiveActions.getQuizList.type, onGetQuizList)
  yield takeEvery(quizArchiveActions.getQuiz.type, onGetQuiz)
  yield takeEvery(quizArchiveActions.updateQuiz.type, onUpdateQuiz)
  yield takeEvery(quizArchiveActions.deleteQuiz.type, onDeleteQuiz)
}

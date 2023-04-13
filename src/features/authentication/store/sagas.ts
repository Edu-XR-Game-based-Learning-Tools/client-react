import { SagaIterator } from '@redux-saga/core'
import { toast } from 'react-toastify'
import { call, put, takeEvery } from 'redux-saga/effects'

import { login, register } from 'features/authentication/services'
import * as globalStore from 'features/global/store'

import { AUTH_KEY } from '../constants'
import { LoginActionType, AuthType, RegisterActionType } from '../types'

import { authenticationActions } from './slice'

// Worker Sagas
function* onLogin({
  payload,
}: {
  type: typeof authenticationActions.login
  payload: LoginActionType
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: AuthType = yield call(login, payload)
    if (res.success) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(res))
      yield put(authenticationActions.setIsLogin(res))
    } else {
      toast.error('Incorrect username or password')
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

function* onRegister({
  payload,
}: {
  type: typeof authenticationActions.register
  payload: RegisterActionType
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: AuthType = yield call(register, payload)
    if (res.success) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(res))
      yield put(authenticationActions.setIsLogin(res))
    } else {
      toast.error('Incorrect username or password')
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

// Watcher Saga
export function* authenticationWatcherSaga(): SagaIterator {
  yield takeEvery(authenticationActions.login.type, onLogin)
  yield takeEvery(authenticationActions.register.type, onRegister)
}

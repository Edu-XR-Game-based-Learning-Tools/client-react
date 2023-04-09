import { SagaIterator } from '@redux-saga/core'
import { toast } from 'react-toastify'
import { call, put, takeEvery } from 'redux-saga/effects'

import { login, register } from 'features/authentication/services'
import * as globalStore from 'features/global/store'

import { LoginActionType, LoginType, RegisterActionType, RegisterType } from '../types'

import { authenticationActions } from './slice'

// Worker Sagas
interface LoginPayloadType {
  status: number
  data: LoginType
}

function* onLogin({
  payload,
}: {
  type: typeof authenticationActions.login
  payload: LoginActionType
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: LoginPayloadType = yield call(login, payload)
    if (res.status === 201) {
      const payloadAction = res.data
      localStorage.setItem('token', payloadAction.access_token)
      localStorage.setItem('id', payloadAction.id)
      yield put(authenticationActions.setIsLogin(payloadAction))
    } else {
      toast.error('Incorrect username or password')
    }
  } catch (error) {
    toast.error(error)
  }
  yield put(globalStore.globalActions.setIsLoading(false))
}

interface RegisterPayloadType {
  status: number
  data: RegisterType
}

function* onRegister({
  payload,
}: {
  type: typeof authenticationActions.register
  payload: RegisterActionType
}): SagaIterator {
  yield put(globalStore.globalActions.setIsLoading(true))
  try {
    const res: RegisterPayloadType = yield call(register, payload)
    if (res.status === 201) {
      const payloadAction = res.data
      localStorage.setItem('token', payloadAction.access_token)
      localStorage.setItem('id', payloadAction.id)
      yield put(authenticationActions.setIsRegister(payloadAction))
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

import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from 'store/hooks'

import { authenticationActions, authenticationSelectors } from '../store'
import { AuthType, LoginActionType, RegisterActionType } from '../types'

export type Operators = {
  authData: AuthType
  login: (data: LoginActionType) => void
  register: (data: RegisterActionType) => void
}

const useService = (): Readonly<Operators> => {
  const dispatch = useAppDispatch()
  const selects = useAppSelector(authenticationSelectors)

  return {
    authData: selects.authData,

    login: useCallback(
      (data: LoginActionType) => {
        dispatch(authenticationActions.login(data))
      },
      [dispatch],
    ),
    register: useCallback(
      (data: RegisterActionType) => {
        dispatch(authenticationActions.register(data))
      },
      [dispatch],
    ),
  }
}

export default useService

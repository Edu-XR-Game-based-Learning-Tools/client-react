import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from 'store/hooks'

import { logout } from '../services'
import { authenticationActions, authenticationSelectors } from '../store'
import { LoginActionType, LoginType, RegisterActionType, RegisterType } from '../types'

export type Operators = {
  loginData: LoginType
  registerData: RegisterType
  login: (data: LoginActionType) => void
  register: (data: RegisterActionType) => void
  logout: () => void
}

/**
 * PostService custom-hooks
 * @see https://reactjs.org/docs/hooks-custom.html
 */
const useService = (): Readonly<Operators> => {
  const dispatch = useAppDispatch()
  const selects = useAppSelector(authenticationSelectors)

  return {
    loginData: selects.loginData,
    registerData: selects.registerData,

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
    logout
  }
}

export default useService

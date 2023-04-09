// DUCKS pattern
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { initLogin, initRegister, LoginActionType, LoginType, RegisterActionType, RegisterType } from 'features/authentication/types'
import type { RootState } from 'store'

export interface AuthenticationState {
  loginData: LoginType
  registerData: RegisterType
}

const initialState: AuthenticationState = {
  loginData: initLogin,
  registerData: initRegister,
}

// slice
export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsLogin(state: AuthenticationState, action: PayloadAction<LoginType>) {
      state.loginData = action.payload
    },
    setIsRegister(state: AuthenticationState, action: PayloadAction<RegisterType>) {
      state.registerData = action.payload
    },
  },
})

// Actions
export const authenticationActions = {
  login: createAction<LoginActionType>(`${authenticationSlice.name}/login`),
  register: createAction<RegisterActionType>(`${authenticationSlice.name}/register`),
  setIsLogin: authenticationSlice.actions.setIsLogin,
  setIsRegister: authenticationSlice.actions.setIsRegister,
}

// Selectors
export const authenticationSelectors = (state: RootState) => state.authentication

// Reducer
export default authenticationSlice.reducer

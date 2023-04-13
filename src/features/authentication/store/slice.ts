// DUCKS pattern
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { initAuth, LoginActionType, RegisterActionType, AuthType } from 'features/authentication/types'
import type { RootState } from 'store'

export interface AuthenticationState {
  authData: AuthType
}

const initialState: AuthenticationState = {
  authData: initAuth,
}

// slice
export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsLogin(state: AuthenticationState, action: PayloadAction<AuthType>) {
      state.authData = action.payload
    },
  },
})

// Actions
export const authenticationActions = {
  login: createAction<LoginActionType>(`${authenticationSlice.name}/login`),
  register: createAction<RegisterActionType>(`${authenticationSlice.name}/register`),
  setIsLogin: authenticationSlice.actions.setIsLogin,
}

// Selectors
export const authenticationSelectors = (state: RootState) => state.authentication

// Reducer
export default authenticationSlice.reducer

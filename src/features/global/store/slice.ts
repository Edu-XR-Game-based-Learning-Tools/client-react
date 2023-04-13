// DUCKS pattern
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from 'store'

export interface GlobalState {
  isLoading: boolean
}

const initialState: GlobalState = {
  isLoading: false,
}

// slice
export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsLoading(state: GlobalState, action: PayloadAction<boolean>) {
      // it's okay to do this here, because immer makes it immutable under the hood
      state.isLoading = action.payload
    },
  },
})

// Actions
export const globalActions = {
  setIsLoading: globalSlice.actions.setIsLoading,
}

// Selectors
export const globalSelectors = (state: RootState) => state.global.isLoading

// Reducer
export default globalSlice.reducer

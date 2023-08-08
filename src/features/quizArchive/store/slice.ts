// DUCKS pattern
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from 'store'

import { initQuizCollectionDto, initQuizCollectionListDto, QuizCollectionDto, QuizCollectionListDto } from '../types'

export interface QuizArchiveState {
  quizCollectionList: QuizCollectionListDto
  editCollection: QuizCollectionDto
  addCollection: QuizCollectionDto
}

const initialState: QuizArchiveState = {
  quizCollectionList: initQuizCollectionListDto,
  editCollection: initQuizCollectionDto,
  addCollection: initQuizCollectionDto
}

// slice
export const quizArchiveSlice = createSlice({
  name: 'quizArchive',
  initialState,
  reducers: {
    setQuizCollectionList(state: QuizArchiveState, action: PayloadAction<QuizCollectionListDto>) {
      state.quizCollectionList = action.payload
    },
    setEditCollection(state: QuizArchiveState, action: PayloadAction<QuizCollectionDto>) {
      state.editCollection = action.payload
    },
    setAddCollection(state: QuizArchiveState, action: PayloadAction<QuizCollectionDto>) {
      state.addCollection = action.payload
    },
  },
})

// Actions
export const quizArchiveActions = {
  getQuizCollectionList: createAction(`${quizArchiveSlice.name}/getQuizCollectionList`),
  getQuizCollection: createAction<number>(`${quizArchiveSlice.name}/getQuizCollection`),
  updateQuizCollection: createAction<QuizCollectionDto>(`${quizArchiveSlice.name}/updateQuizCollection`),
  deleteQuizCollection: createAction<QuizCollectionDto>(`${quizArchiveSlice.name}/deleteQuizCollection`),
  setQuizCollectionList: quizArchiveSlice.actions.setQuizCollectionList,
  setEditCollection: quizArchiveSlice.actions.setEditCollection,
  setAddCollection: quizArchiveSlice.actions.setAddCollection,
}

// Selectors
export const quizArchiveSelectors = (state: RootState) => state.quizArchive

// Reducer
export default quizArchiveSlice.reducer

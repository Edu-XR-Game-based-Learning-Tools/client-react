// DUCKS pattern
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from 'store'

import { initQuizData, initQuizList, QuizData, QuizList } from '../types'

export interface QuizArchiveState {
  quizList: QuizList
  editQuiz: QuizData 
}

const initialState: QuizArchiveState = {
  quizList: initQuizList,
  editQuiz: initQuizData
}

// slice
export const quizArchiveSlice = createSlice({
  name: 'quizArchive',
  initialState,
  reducers: {
    setQuizList(state: QuizArchiveState, action: PayloadAction<QuizList>) {
      state.quizList = action.payload
    },
    setEditQuiz(state: QuizArchiveState, action: PayloadAction<QuizData>) {
      state.editQuiz = action.payload
    },
  },
})

// Actions
export const quizArchiveActions = {
  getQuizList: createAction(`${quizArchiveSlice.name}/getQuizList`),
  getQuiz: createAction<number>(`${quizArchiveSlice.name}/getQuiz`),
  updateQuiz: createAction<QuizData>(`${quizArchiveSlice.name}/updateQuiz`),
  deleteQuiz: createAction<QuizData>(`${quizArchiveSlice.name}/deleteQuiz`),
  setQuizList: quizArchiveSlice.actions.setQuizList,
  setEditQuiz: quizArchiveSlice.actions.setEditQuiz,
}

// Selectors
export const quizArchiveSelectors = (state: RootState) => state.quizArchive

// Reducer
export default quizArchiveSlice.reducer

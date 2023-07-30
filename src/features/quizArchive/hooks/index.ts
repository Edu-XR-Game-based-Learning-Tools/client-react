import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from 'store/hooks'

import { quizArchiveActions, quizArchiveSelectors } from '../store'
import { QuizData, QuizList } from '../types'

export type Operators = {
  quizList: QuizList
  editQuiz: QuizData
  getQuizList: () => void
  getQuiz: (data: number) => void
  updateQuiz: (data: QuizData) => void
  deleteQuiz: (data: QuizData) => void
}

/**
 * PostService custom-hooks
 * @see https://reactjs.org/docs/hooks-custom.html
 */
const useService = (): Readonly<Operators> => {
  const dispatch = useAppDispatch()
  const selects = useAppSelector(quizArchiveSelectors)

  return {
    quizList: selects.quizList,
    editQuiz: selects.editQuiz,

    getQuizList: useCallback(
      () => {
        dispatch(quizArchiveActions.getQuizList())
      },
      [dispatch],
    ),
    getQuiz: useCallback(
      (data: number) => {
        dispatch(quizArchiveActions.getQuiz(data))
      },
      [dispatch],
    ),
    updateQuiz: useCallback(
      (data: QuizData) => {
        dispatch(quizArchiveActions.updateQuiz(data))
      },
      [dispatch],
    ),
    deleteQuiz: useCallback(
      (data: QuizData) => {
        dispatch(quizArchiveActions.deleteQuiz(data))
      },
      [dispatch],
    ),
  }
}

export default useService

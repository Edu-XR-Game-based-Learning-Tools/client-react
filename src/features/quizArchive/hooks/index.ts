import { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from 'store/hooks'

import { quizArchiveActions, quizArchiveSelectors } from '../store'
import { QuizCollectionDto, QuizCollectionListDto } from '../types'

export type Operators = {
  quizList: QuizCollectionListDto
  editQuiz: QuizCollectionDto
  getQuizCollectionList: () => void
  getQuizCollection: (data: number) => void
  updateQuizCollection: (data: QuizCollectionDto) => void
  deleteQuizCollection: (data: QuizCollectionDto) => void
}

const useQuizArchiveService = (): Readonly<Operators> => {
  const dispatch = useAppDispatch()
  const selects = useAppSelector(quizArchiveSelectors)

  return {
    quizList: selects.quizCollectionList,
    editQuiz: selects.editCollection,

    getQuizCollectionList: useCallback(
      () => {
        dispatch(quizArchiveActions.getQuizCollectionList())
      },
      [dispatch],
    ),
    getQuizCollection: useCallback(
      (data: number) => {
        dispatch(quizArchiveActions.getQuizCollection(data))
      },
      [dispatch],
    ),
    updateQuizCollection: useCallback(
      (data: QuizCollectionDto) => {
        dispatch(quizArchiveActions.updateQuizCollection(data))
      },
      [dispatch],
    ),
    deleteQuizCollection: useCallback(
      (data: QuizCollectionDto) => {
        dispatch(quizArchiveActions.deleteQuizCollection(data))
      },
      [dispatch],
    ),
  }
}

export default useQuizArchiveService

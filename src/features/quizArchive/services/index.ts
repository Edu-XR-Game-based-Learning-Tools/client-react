import { DEFAULT_TIMEOUT } from 'config/defines'
import axiosInstance from 'libs/core/configureAxios'

import { QuizData, QuizList } from '../types'

const BASE_URL = `/api/quiz`

export const getQuizList = (): Promise<QuizList> =>
  axiosInstance.get(`${BASE_URL}/getQuizList`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  })

export const getQuiz = (id: number): Promise<QuizData> =>
  axiosInstance.get(`${BASE_URL}/getQuiz`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    params: id
  })

export const updateQuiz = (payload: QuizData): Promise<QuizData> =>
  axiosInstance.post(`${BASE_URL}/updateQuiz`, payload, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  })

export const deleteQuiz = (payload: QuizData): Promise<QuizList> =>
  axiosInstance.delete(`${BASE_URL}/deleteQuiz`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    data: payload
  })

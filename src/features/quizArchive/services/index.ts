import { DEFAULT_TIMEOUT } from 'config/defines'
import axiosInstance from 'libs/core/configureAxios'

import { QuizCollectionDto, QuizCollectionListDto } from '../types'

const BASE_URL = `/api/quiz`

export const getQuizCollectionList = (): Promise<QuizCollectionListDto> =>
  axiosInstance.get(`${BASE_URL}/getQuizCollectionList`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  })

export const getQuizCollection = (id: number): Promise<QuizCollectionDto> =>
  axiosInstance.get(`${BASE_URL}/getQuizCollection`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    params: { id }
  })

export const updateQuizCollection = (payload: QuizCollectionDto): Promise<QuizCollectionDto> =>
  axiosInstance.post(`${BASE_URL}/updateQuizCollection`, payload, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
  })

export const deleteQuizCollection = (payload: QuizCollectionDto): Promise<QuizCollectionListDto> =>
  axiosInstance.delete(`${BASE_URL}/deleteQuizCollection`, {
    signal: AbortSignal.timeout(DEFAULT_TIMEOUT),
    data: payload
  })

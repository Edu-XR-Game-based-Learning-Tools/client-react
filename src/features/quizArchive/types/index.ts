import { ResponseMessage } from "features/authentication/types"

export interface BaseDto extends ResponseMessage {
  eId: number | null
  createdAt: Date | null
  updatedAt: Date | null
  name: string | null
}

export interface QuizDto extends BaseDto {
  question: string
  thumbnail: string | null
  model: string | null
  image: string | null

  answers: string[]
  correctIdx: number
  duration: number
}

export const initQuizDto: QuizDto = {
  eId: null,
  name: null,
  question: '',
  thumbnail: null,
  model: null,
  image: null,

  answers: ['', '', '', ''],
  correctIdx: 0,
  duration: 60,
  createdAt: null,
  updatedAt: null,
  message: "",
  success: false
}

export interface QuizCollectionDto extends BaseDto {
  description: string | null
  configuration: string | null
  quizzes: QuizDto[]
}

export const initQuizCollectionDto: QuizCollectionDto = {
  eId: null,
  name: '#Collection',
  description: null,
  configuration: null,
  quizzes: [],

  message: '',
  success: false,
  createdAt: null,
  updatedAt: null,
}

export interface QuizCollectionListDto extends ResponseMessage {
  collections: QuizCollectionDto[]
}

export const initQuizCollectionListDto: QuizCollectionListDto = {
  collections: [],
  message: '',
  success: false
}

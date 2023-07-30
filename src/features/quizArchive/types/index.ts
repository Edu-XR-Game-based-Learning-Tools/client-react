import { ResponseMessage } from "features/authentication/types"

export interface QuestionData {
  id: number
  question: string
  answers: string[]
  correctAnswer: number | null
  duration: number
  imageUrl: string | null
  modelUrl: string | null
}

export const initQuestionData: QuestionData = {
  id: 0,
  question: 'string',
  answers: [],
  correctAnswer: null,
  duration: 0,
  imageUrl: null,
  modelUrl: null
}

export interface QuizData extends ResponseMessage {
  id: number
  questions: QuestionData[]
  name: string
  thumbNail: string | null
}

export const initQuizData: QuizData = {
  id: 0,
  questions: [],
  name: '',
  thumbNail: null,
  message: '',
  success: false
}

export interface QuizList extends ResponseMessage {
  quizzes: QuizData[]
}

export const initQuizList: QuizList = {
  quizzes: [],
  message: '',
  success: false
}

import createSagaMiddleware from '@redux-saga/core'
import { configureStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import { createReduxHistoryContext } from 'redux-first-history'
import logger from 'redux-logger'

import { Env } from 'config/Env'
import authenticationReducer, { AuthenticationState } from 'features/authentication/store/slice'
import globalReducer, { GlobalState } from 'features/global/store/slice'
import postsReducer from 'features/posts/store/posts.slice'
import quizArchiveReducer, { QuizArchiveState } from 'features/quizArchive/store/slice'

import { rootSaga } from './rootSaga'

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
  reduxTravelling: Env.isDev(),
  savePreviousLocations: 1,
})

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: {
      router: routerReducer,
      global: globalReducer,
      authentication: authenticationReducer,
      quizArchive: quizArchiveReducer,
      posts: postsReducer,
    },
    devTools: Env.isDev(),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ thunk: false })
        .concat(sagaMiddleware)
        .concat(routerMiddleware)
        .concat(logger),
  })

  sagaMiddleware.run(rootSaga)

  return store
}

export const store = makeStore()

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const history = createReduxHistory(store)

export interface ReducerType {
  authentication: AuthenticationState
  quizArchive: QuizArchiveState
  global: GlobalState
}

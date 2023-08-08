import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import Layout from 'components/Layout'
import { GlobalState } from 'features/global'
import LoadingComponent from 'libs/ui/components/Loading'
import { ReducerType } from 'store'

import PrivateRoute from './PrivateRoute'

const LoginPage = React.lazy(() => import('pages/LoginPage'))
const HomePage = React.lazy(() => import('pages/HomePage'))
const QuizArchivePage = React.lazy(() => import('pages/QuizArchivePage'))
const EditQuizPage = React.lazy(() => import('pages/EditQuizPage'))
const NotFoundPage = React.lazy(() => import('pages/NotFoundPage'))

interface RoutesProps {
  global: GlobalState
  isLoggedIn: boolean
}

const mapStateToProps = (state: ReducerType) => state

const AppRoutes = (props: RoutesProps) => {
  const { global, isLoggedIn } = props

  return (
    <Suspense fallback={<LoadingComponent isLoading={global.isLoading} />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn} />} >
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<QuizArchivePage />} />
            <Route path="/archive/edit/:id" element={<EditQuizPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default connect(mapStateToProps)(AppRoutes)

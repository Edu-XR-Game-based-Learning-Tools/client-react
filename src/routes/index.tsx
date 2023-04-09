import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import Layout from 'components/Layout'
import { GlobalState } from 'features/global'
import LibComponent from 'libs/ui/components/Loading'
import { ReducerType } from 'store'

import PrivateRoute from './PrivateRoute'

const LoginPage = React.lazy(() => import('pages/LoginPage'))
const HomePage = React.lazy(() => import('pages/HomePage'))
const AboutPage = React.lazy(() => import('pages/AboutPage'))
const NotFoundPage = React.lazy(() => import('pages/NotFoundPage'))

interface RoutesProps {
  global: GlobalState
  isLoggedIn: boolean
}

const mapStateToProps = (state: ReducerType) => state

const AppRoutes = (props: RoutesProps) => {
  const { global, isLoggedIn } = props

  return (
    <Suspense fallback={<LibComponent isLoading={global.isLoading} />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn} />} >
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
          <Route element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default connect(mapStateToProps)(AppRoutes)

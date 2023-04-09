import { History } from 'history'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { HistoryRouter as Router } from 'redux-first-history/rr6'

import 'App.css'
import { initUserPreference, LoginType, RegisterType, UserPreference } from 'features/authentication'
import AppRoutes from 'routes'
import { ReducerType } from 'store'

type AppProps = {
  history: History
  loginData: LoginType
  registerData: RegisterType
  userPref: UserPreference
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: ReducerType) => ({
  loginData: state.authentication?.loginData,
  registerData: state.authentication?.registerData,
  userPref: initUserPreference
})

const App = (props: AppProps) => {
  const { history, loginData, registerData, } = props
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('id')))
  const [width, setWidth] = useState(window.innerWidth)
  const [, setIsMobile] = useState(false)

  const handleWindowResize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    if (width < 1024) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [width])


  useEffect(() => {
    if (loginData.id || registerData.id.length !== 0) {
      setIsLoggedIn(Boolean(setIsLoggedIn))
    } else {
      setIsLoggedIn(Boolean(localStorage.getItem('id')))
    }
  }, [loginData.id, registerData.id])

  return (
    <Router history={history}>
      <AppRoutes isLoggedIn={isLoggedIn} />
    </Router>
  )
}

export default connect(mapStateToProps)(App)
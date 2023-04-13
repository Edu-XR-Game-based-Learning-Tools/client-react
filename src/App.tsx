import { History } from 'history'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { HistoryRouter as Router } from 'redux-first-history/rr6'

import 'App.css'
import { initUserPreference, AuthType, UserPreference } from 'features/authentication'
import { checkToken } from 'libs/core/configureAxios'
import AppRoutes from 'routes'
import { ReducerType } from 'store'

type AppProps = {
  history: History
  authData: AuthType
  userPref: UserPreference
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: ReducerType) => ({
  authData: state.authentication?.authData,
  userPref: initUserPreference
})

const App = (props: AppProps) => {
  const { history, authData } = props
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
    if (checkToken()) {
      setIsLoggedIn(Boolean(setIsLoggedIn))
    } else {
      setIsLoggedIn(Boolean(localStorage.getItem('id')))
    }
  }, [authData])

  return (
    <Router history={history}>
      <AppRoutes isLoggedIn={isLoggedIn} />
    </Router>
  )
}

export default connect(mapStateToProps)(App)
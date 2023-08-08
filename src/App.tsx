import { History } from 'history'
import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { HistoryRouter as Router } from 'redux-first-history/rr6'

import 'App.css'
import { AuthType, UserPreference, initUserPreference } from 'features/authentication'
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
  const [isLoggedIn, setIsLoggedIn] = useState(checkToken())
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
    if (authData.accessToken) {
      setIsLoggedIn(Boolean(setIsLoggedIn))
    } else {
      setIsLoggedIn(checkToken())
    }
  }, [authData])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(107.56deg, #aaccdd 12.02%, #bbddff 62.02%)',
    }}>
      <Router history={history}>
        <AppRoutes isLoggedIn={isLoggedIn} />
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </div>
  )
}

export default connect(mapStateToProps)(App)
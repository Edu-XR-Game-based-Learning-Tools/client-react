import { Backdrop, CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import images from 'config/images'
import { checkToken } from 'libs/core/configureAxios'
import { ReducerType } from 'store'

import { AuthType } from '../types'

import LandingPage from './LandingPage'
import Login from './Login'
import Register from './Register'

const mapStateToProps = (state: ReducerType) => ({
  authData: state.authentication.authData,
  isLoading: state.global.isLoading,
})

interface AuthProps {
  authData: AuthType
  isLoading: boolean
}

const AuthenticationContainer = (props: AuthProps) => {
  const { t } = useTranslation()
  const { authData, isLoading } = props
  const [isLoginPage, setIsLoginPage] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(checkToken())
  const navigate = useNavigate()

  const setLogin = () => {
    setIsLoginPage(!isLoginPage)
  }

  useEffect(() => {
    if (authData.accessToken) {
      setIsLoggedIn(Boolean(setIsLoggedIn))
    } else {
      setIsLoggedIn(checkToken())
    }
  }, [authData])

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [navigate, isLoggedIn])

  return (
    <Grid container style={{
      minHeight: '100vh',
      background: 'linear-gradient(107.56deg, #222629 12.02%, #1E453E 62.02%)',
    }}>
      <Grid container item xs={6} style={{ padding: '5rem 0 0 8rem', }}>
        <Grid container style={{ height: 'fit-content', }}>
          <img src={images.AppIcon} alt={images.AppIcon} />
          <Typography style={{
            fontSize: '5rem',
            fontFamily: 'Poppins',
            background: '-webkit-linear-gradient(180deg, #FCE38A 0%, #CC2A2A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginLeft: '2rem',
          }}>{t('company.title')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            background: '-webkit-linear-gradient(180deg, #B3B990 100%, #86C232 47%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Poppins',
          }}>
            Join the
            <span style={{
              fontSize: '6rem',
              background: '-webkit-linear-gradient(180deg, #86C232 100%, #86C232 100%)',
              WebkitBackgroundClip: 'text',
              fontWeight: 'bold',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Poppins',
            }}> fun.</span>
          </Typography>
        </Grid>
        <img src={images.GameIcon} alt={images.GameIcon} style={{
          objectFit: 'cover',
          opacity: 0.7,
          transform: 'rotate(30deg)',
          margin: '0 0 20% 0'
        }} />
      </Grid>
      <Grid container item xs={6} alignItems="center" justifyContent="center">
        {isLoginPage ? <Login setLogin={setLogin} /> : <Register setLogin={setLogin} />}
      </Grid>
      <LandingPage />
      <Backdrop style={{
        zIndex: 1,
        color: '#fff',
      }} open={isLoading}>
        <CircularProgress style={{ color: '#E9781C' }} />
      </Backdrop>
    </Grid>
  )
}

export default connect(mapStateToProps)(AuthenticationContainer)

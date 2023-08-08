import { Button, Grid, IconButton, InputAdornment, InputBase, Typography } from '@mui/material'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { PASSWORD_REGEX_ERROR, USERNAME_REGEX_ERROR } from 'config/defines'
import images from 'config/images'
import { useAuthenticationService } from 'features/authentication/hooks'
import { LoginActionType } from 'features/authentication/types'
import { ReducerType } from 'store'

import classes from '../SharedStyles/loginStyles'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = (state: ReducerType) => ({
})

interface LoginProps {
  setLogin: () => void
}

const Login = (props: LoginProps) => {
  const { setLogin } = props
  const [isShowPass, setIsShowPass] = useState(false)
  const { handleSubmit, register, formState: { errors } } = useForm<LoginActionType>()
  const { login } = useAuthenticationService.default()

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
  }

  const handleClickShowPassword = () => {
    setIsShowPass(!isShowPass)
  }

  const onSubmit = (values: LoginActionType) => {
    const { username, password } = values
    login({
      username,
      password,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.rootFormContainer}>
      <Grid container direction="column">
        <Typography classes={{ root: classes.inputLabel }}>Username:</Typography>
        <InputBase
          placeholder="Username"
          className={classes.rootUsername}
          {...register('username', {
            required: true,
            maxLength: 16,
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/,
          })}
        />
        {errors.username && (
          <span className={classes.error}>
            <images.InfoIcon />
            {errors.username.type === 'required'
              ? 'Username is required'
              : USERNAME_REGEX_ERROR}
          </span>
        )}
        <Typography classes={{ root: clsx(classes.inputLabel, classes.rootPasswordLabel) }}>
          Password:
        </Typography>
        <InputBase
          placeholder="Password"
          type={isShowPass ? 'text' : 'password'}
          classes={{ root: classes.rootUsername }}
          {...register('password', {
            required: true,
            maxLength: 16,
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/,
          })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                style={{ color: 'white' }}>
                {isShowPass ? <images.VisibilityIcon /> : <images.VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.password && (
          <span className={classes.error}>
            <images.InfoIcon />
            {errors.password.type === 'required'
              ? 'Password is required'
              : PASSWORD_REGEX_ERROR}
          </span>
        )}
        <Button classes={{ root: classes.rootSignInButton }} type="submit">
          sign in
        </Button>
        <Grid container direction="row" alignItems="center">
          <Grid classes={{ root: classes.rootDivider }} />
          <Typography classes={{ root: classes.rootOR }}>OR</Typography>
          <Grid classes={{ root: classes.rootDivider }} />
        </Grid>
        <Button classes={{ root: classes.rootSignUpButton }} onClick={setLogin}>
          go to sign up
        </Button>
      </Grid>
    </form>
  )
}

export default connect(mapStateToProps)(Login)

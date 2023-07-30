/* eslint-disable no-nested-ternary */
import {
  Button,
  Grid, IconButton,
  InputAdornment, InputBase, Typography
} from '@mui/material'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { PASSWORD_REGEX_ERROR, USERNAME_REGEX_ERROR } from 'config/defines'
import images from 'config/images'
import { RegisterActionType } from 'features/authentication'
import { useAuthenticationService } from 'features/authentication/hooks'
import { ReducerType } from 'store'

import classes from '../SharedStyles/loginStyles'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = (state: ReducerType) => ({
})

interface RegisterProps {
  setLogin: () => void
}

const Register = (props: RegisterProps) => {
  const { setLogin } = props
  const [isShowPass, setIsShowPass] = useState(false)
  const [isShowRePass, setIsShowRePass] = useState(false)
  const { handleSubmit, register, formState: { errors }, getValues } = useForm<RegisterActionType>()
  const service = useAuthenticationService.default()
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
  }

  const handleClickShowPassword = () => {
    setIsShowPass(!isShowPass)
  }

  const handleClickShowRePassword = () => {
    setIsShowRePass(!isShowRePass)
  }

  const onSubmit = (values: RegisterActionType) => {
    const { username, password, email, repassword } = values
    service.register({
      username,
      password,
      email,
      repassword,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.rootFormContainer}>
      <Grid container direction="column">
        <Typography classes={{ root: classes.inputLabel }}>Username:</Typography>
        <InputBase
          placeholder="Username"
          classes={{ root: classes.rootUsername }}
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
        <Typography classes={{ root: clsx(classes.inputLabel, classes.rootPasswordLabel) }}>
          Confirm Password:
        </Typography>
        <InputBase
          placeholder="Confirm Password"
          type={isShowRePass ? 'text' : 'password'}
          classes={{ root: classes.rootUsername }}
          {...register('repassword', {
            required: true,
            maxLength: 16,
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/,
            validate: {
              equalPassword: (value) => value === getValues('password'),
            },
          })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle repassword visibility"
                onClick={handleClickShowRePassword}
                onMouseDown={handleMouseDownPassword}
                style={{ color: 'white' }}>
                {isShowRePass ? <images.VisibilityIcon /> : <images.VisibilityOffIcon />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.repassword && (
          <span className={classes.error}>
            <images.InfoIcon />
            {errors.repassword.type === 'required'
              ? 'Repassword is required'
              : errors.repassword.type === 'pattern'
                ? PASSWORD_REGEX_ERROR
                : 'The repassword must be the same with password'}
          </span>
        )}

        <Typography classes={{ root: clsx(classes.inputLabel, classes.rootPasswordLabel) }}>
          Email:
        </Typography>
        <InputBase
          placeholder="Input email"
          type="text"
          classes={{ root: classes.rootUsername }}
          {...register('email', { required: true, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ })}
        />
        {errors.email && (
          <span className={classes.error}>
            <images.InfoIcon />
            {errors.email.type === 'required'
              ? 'Email is required'
              : 'Please input correct email format'}
          </span>
        )}

        <Button classes={{ root: classes.rootSignInButton }} type="submit">
          sign up
        </Button>
        <Grid container direction="row" alignItems="center">
          <Grid classes={{ root: classes.rootDivider }} />
          <Typography classes={{ root: classes.rootOR }}>OR</Typography>
          <Grid classes={{ root: classes.rootDivider }} />
        </Grid>
        <Button classes={{ root: classes.rootSignUpButton }} onClick={setLogin}>
          go to sign in
        </Button>
      </Grid>
    </form>
  )
}

export default connect(mapStateToProps)(Register)

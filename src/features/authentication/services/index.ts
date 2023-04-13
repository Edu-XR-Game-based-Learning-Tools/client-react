import axiosInstance from 'libs/core/configureAxios'

import { AuthType, LoginActionType, RegisterActionType } from '../types'

const BASE_URL = `/api/auth`

export const login = (payload: LoginActionType): Promise<AuthType> =>
  axiosInstance.post(`${BASE_URL}/login`, payload)

export const register = (payload: RegisterActionType): Promise<AuthType> =>
  axiosInstance.post(`${BASE_URL}/register`, payload)

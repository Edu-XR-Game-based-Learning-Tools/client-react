import axiosInstance from 'libs/core/configureAxios'

import { LoginActionType, LoginType, RegisterActionType, RegisterType } from '../types'

const BASE_URL = `/authentication`

export const login = (payload: LoginActionType): Promise<LoginType> =>
  axiosInstance.post(`${BASE_URL}/login`, payload)

export const register = (payload: RegisterActionType): Promise<RegisterType> =>
  axiosInstance.post(`${BASE_URL}/register`, payload)

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('id')
}

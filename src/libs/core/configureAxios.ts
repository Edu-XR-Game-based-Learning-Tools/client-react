import axios from 'axios'

import { Env } from 'config/Env'
import { AUTH_KEY } from 'features/authentication/constants'
import { AuthType, RefreshTokenActionType } from 'features/authentication/types'


export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
  window.location.reload()
}

export const checkToken = () => {
  const token = localStorage.getItem(AUTH_KEY)
  if (!token) return false

  const authData: AuthType = JSON.parse(token)
  if (!authData || !authData.accessToken || !authData.accessToken.token) return false

  const expTime = new Date(authData.accessToken.issuedAt)
  expTime.setSeconds(expTime.getSeconds() + authData.accessToken.expiresIn)
  if (expTime > new Date()) return true

  logout()
  return false
}

function getDifferenceInMinutes(date1: Date, date2: Date) {
  const diffInMs = Math.abs(date1.getTime() - date2.getTime())
  return diffInMs / (1000 * 60)
}

export const refreshToken = (payload: RefreshTokenActionType): Promise<AuthType> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  axiosInstance.post(`${`/api/auth`}/refreshToken`, payload)

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const tryRefreshToken = async () => {
  if (checkToken()) return

  // Call refresh before expire time 2 minutes
  const authData: AuthType = JSON.parse(localStorage.getItem(AUTH_KEY)!)
  const expTime = new Date(authData.accessToken!.issuedAt)
  expTime.setSeconds(expTime.getSeconds() + authData.accessToken!.expiresIn)

  if (getDifferenceInMinutes(expTime, new Date()) <= 2)
    await refreshToken({
      accessToken: authData.accessToken!.token,
      refreshToken: authData.refreshToken,
    })
}

function makeApi(baseURL: string) {
  const api = axios.create({
    baseURL,
  })

  api.defaults.headers.post['Content-Type'] = 'application/json'
  api.defaults.headers.put['Content-Type'] = 'application/json'
  api.defaults.headers.delete['Content-Type'] = 'application/json'

  api.interceptors.request.use(
    async config => {
      const token = localStorage.getItem(AUTH_KEY)
      if (!token) return config

      if (checkToken())
        await tryRefreshToken()

      const authToken: AuthType = JSON.parse(token)
      if (authToken && authToken.accessToken) {
        if (config && config.headers) {
          config.headers.Authorization = `Bearer ${authToken.accessToken.token}`;
        }
      }

      return config
    },
    error => Promise.reject(error),
  )

  api.interceptors.response.use(
    response => response.data, // return data object
    error => Promise.reject(error),
  )
  return api
}
declare global {
  interface Window { logout: () => void }
}

window.logout = logout

const axiosInstance = makeApi(`${Env.API_BASE_URL}`)
export default axiosInstance

import axios from 'axios'

import { Env } from 'config/Env'
import { AUTH_KEY } from 'features/authentication/constants'
import { AuthType, RefreshTokenActionType } from 'features/authentication/types'

interface JwtDataType {
  id: string
  role: string
}

export const getJwtData = (): JwtDataType | null => {
  const token = localStorage.getItem(AUTH_KEY)
  if (!token) return null
  const authToken: AuthType = JSON.parse(token)
  if (!(authToken && authToken.accessToken)) return null

  const base64Url = authToken.accessToken.token.split('.')[1]
  const base64 = base64Url.replace('/-/g', '+').replace('/_/g', '/')
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((ele) =>
    `%${(`00${ele.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''))
  return JSON.parse(jsonPayload)
}

export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
  window.location.reload()
}

export const checkToken = (isLogoutAfterThat: boolean = true) => {
  const token = localStorage.getItem(AUTH_KEY)
  if (!token) return false

  const authData: AuthType = JSON.parse(token)
  if (!authData || !authData.accessToken || !authData.accessToken.token) return false

  const expTime = new Date(authData.accessToken.issuedAt)
  expTime.setSeconds(expTime.getSeconds() + authData.accessToken.expiresIn)
  if (expTime > new Date()) return true

  if (isLogoutAfterThat) logout()
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
  if (checkToken(false)) return

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

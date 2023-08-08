export interface ResponseMessage {
  message: string
  success: boolean
}

export interface AccessToken {
  token: string
  expiresIn: number
  issuedAt: Date
}

export interface AuthType extends ResponseMessage {
  accessToken: AccessToken | null
  refreshToken: string
}

export const initAuth: AuthType = {
  accessToken: null,
  refreshToken: '',
  message: '',
  success: false
}

export interface RegisterActionType {
  username: string
  email: string
  password: string
  repassword: string
}

export interface LoginActionType {
  username: string
  password: string
}

export interface RefreshTokenActionType {
  accessToken: string
  refreshToken: string
}

export interface UserInfo {
  UserId: string
  FirstName: string
  LastName: string
  Email: string
  AvatarUrl: string
  Status: number
}

export const initUserInfo = {
  UserId: '',
  FirstName: '',
  LastName: '',
  Email: '',
  AvatarUrl: '',
  Status: 0,
}

export interface UserPreference {
  UserId: string
  UserName: string
  AvatarUrl: string | null
  Email: string
  Address: string | null
  Dob: Date | null
  FirstName: string
  LastName: string
  ThemeId: number | null
  RoleName: string
  Status: number
  BtnBackgroundColor: string | null
  BtnTextColor: string | null
  BackgroundColorOpacity: number | null
  BackgroundColor: string | null
  LinkColor: string | null
}

export const initUserPreference: UserPreference = {
  UserId: '',
  Address: null,
  UserName: '',
  AvatarUrl: null,
  Email: '',
  Dob: null,
  FirstName: '',
  LastName: '',
  ThemeId: null,
  RoleName: '',
  Status: 1,
  BtnBackgroundColor: null,
  BtnTextColor: null,
  BackgroundColorOpacity: null,
  BackgroundColor: null,
  LinkColor: null,
}

export interface RegisterType {
  access_token: string
  id: string
}

export const initRegister: RegisterType = {
  access_token: '',
  id: '',
}

export interface LoginType extends RegisterType {
  email: string
  firstName: string
  lastName: string
  avatarUrl: string | null
  role: string
  themeId: number
  backgroundColor: string | null
  btnBackgroundColor: string | null
  btnTextColor: string | null
  linkColor: string | null
  backgroundColorOpacity: number | null
}

export const initLogin: LoginType = {
  id: '',
  access_token: '',
  email: '',
  firstName: '',
  lastName: '',
  avatarUrl: null,
  role: '',
  themeId: 0,
  backgroundColor: null,
  btnBackgroundColor: null,
  btnTextColor: null,
  linkColor: null,
  backgroundColorOpacity: null,
}

export interface RegisterActionType {
  username: string
  email: string
  password: string
}

export interface LoginActionType {
  username: string
  password: string
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

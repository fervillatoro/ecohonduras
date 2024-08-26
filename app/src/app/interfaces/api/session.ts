export interface Session {
  isLogged: boolean,
  userInfo: {
    id: number,
    shortname: string
  } | null
}
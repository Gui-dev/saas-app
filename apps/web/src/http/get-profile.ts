import { api } from './api-client'

export interface IGetProfileResponse {
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
}

export const getProfile = async (): Promise<IGetProfileResponse> => {
  const profile = await api.get('profile').json<IGetProfileResponse>()

  return profile
}

import { api } from './api-client'

export interface ISignInWithPasswordRequest {
  email: string
  password: string
}

export interface ISignInWithPasswordResponse {
  token: string
}

export const signInWithPassword = async ({
  email,
  password,
}: ISignInWithPasswordRequest): Promise<ISignInWithPasswordResponse> => {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<ISignInWithPasswordResponse>()

  return result
}

import { api } from './api-client'

export interface ISignUpRequest {
  name: string
  email: string
  password: string
}

export interface ISignUpResponse {
  id: string
}

export const signUp = async ({
  name,
  email,
  password,
}: ISignUpRequest): Promise<ISignUpResponse> => {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<ISignUpResponse>()

  return result
}

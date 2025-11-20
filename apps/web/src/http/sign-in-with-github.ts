import { api } from './api-client'

export interface ISignInWithGithubRequest {
  code: string
}

export interface ISignInWithGithubResponse {
  token: string
}

export const signInWithGithub = async ({
  code,
}: ISignInWithGithubRequest): Promise<ISignInWithGithubResponse> => {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<ISignInWithGithubResponse>()

  return result
}

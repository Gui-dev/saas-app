import { api } from './api-client'

export interface ICreateProjectRequest {
  orgSlug: string
  name: string
  description: string
}

export interface ICreateProjectResponse {
  id: string
}

export const createProject = async ({
  orgSlug,
  name,
  description,
}: ICreateProjectRequest): Promise<ICreateProjectResponse> => {
  const result = await api
    .post(`organizations/${orgSlug}/projects`, {
      json: {
        name,
        description,
      },
    })
    .json<ICreateProjectResponse>()

  return result
}

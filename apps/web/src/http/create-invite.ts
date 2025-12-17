import { Role } from '@saas/auth'
import { api } from './api-client'

export interface ICreateInviteRequest {
  org: string
  email: string
  role: Role
}

export interface ICreateInviteResponse {
  id: string
}

export const createInvite = async ({
  org,
  email,
  role,
}: ICreateInviteRequest): Promise<ICreateInviteResponse> => {
  const result = await api
    .post(`organizations/${org}/invites`, {
      json: {
        email,
        role,
      },
    })
    .json<ICreateInviteResponse>()

  return result
}

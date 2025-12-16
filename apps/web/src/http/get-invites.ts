import { Role } from '@saas/auth'
import { api } from './api-client'

export interface IGetInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    autor: {
      id: string
      name: string | null
    } | null
  }[]
}

export interface IGetInvitesRequest {
  org: string
}

export const getInvites = async ({ org }: IGetInvitesRequest) => {
  const invites = await api
    .get(`organizations/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<IGetInvitesResponse>()

  return invites
}

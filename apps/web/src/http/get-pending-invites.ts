import { Role } from '@saas/auth'
import { api } from './api-client'

export interface IGetPendingInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    organization: {
      name: string
    }
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export const getPendingInvites = async () => {
  const invites = await api
    .get('pending-invites')
    .json<IGetPendingInvitesResponse>()

  return invites
}

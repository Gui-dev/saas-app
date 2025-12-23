import { Role } from '@saas/auth'
import { api } from './api-client'

export interface IGetInviteResponse {
  invite: {
    id: string
    email: string
    role: Role
    organization: {
      id: string
      name: string
    }
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }
}

export interface IGetInviteRequest {
  inviteId: string
}

export const getInvite = async ({ inviteId }: IGetInviteRequest) => {
  const invite = await api.get(`invites/${inviteId}`).json<IGetInviteResponse>()

  return invite
}

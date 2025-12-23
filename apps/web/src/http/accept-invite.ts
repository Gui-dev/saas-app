import { Role } from '@saas/auth'
import { api } from './api-client'

export interface IAcceptInviteRequest {
  inviteId: string
}

export interface IAcceptInviteResponse {
  id: string
}

export const acceptInvite = async ({
  inviteId,
}: IAcceptInviteRequest): Promise<IAcceptInviteResponse> => {
  const result = await api
    .post(`invites/${inviteId}/accept`)
    .json<IAcceptInviteResponse>()

  return result
}

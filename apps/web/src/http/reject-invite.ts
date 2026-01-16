import { api } from './api-client'

export interface IRejectInviteRequest {
  inviteId: string
}

export const rejectInvite = async ({
  inviteId,
}: IRejectInviteRequest): Promise<void> => {
  await api.post(`invites/${inviteId}/reject`).json()
}

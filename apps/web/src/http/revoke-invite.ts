import { api } from './api-client'

export interface IRevokeInviteRequest {
  org: string
  inviteId: string
}

export const revokeInvite = async ({
  org,
  inviteId,
}: IRevokeInviteRequest): Promise<void> => {
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}

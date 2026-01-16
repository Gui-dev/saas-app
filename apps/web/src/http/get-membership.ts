import type { Role } from '@saas/auth'
import { api } from './api-client'

export interface IGetMembershipResponse {
  membership: {
    id: string
    organizationId: string
    userId: string
    role: Role
  }
}

export const getMembership = async (
  slug: string
): Promise<IGetMembershipResponse> => {
  const membership = await api
    .get(`organizations/${slug}/membership`)
    .json<IGetMembershipResponse>()

  return membership
}

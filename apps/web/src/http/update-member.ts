import type { Role } from '@saas/auth'
import { api } from './api-client'

export interface IUpdateMemberRequest {
  org: string
  memberId: string
  role: Role
}

export const updateMember = async ({
  org,
  memberId,
  role,
}: IUpdateMemberRequest): Promise<void> => {
  await api.put(`organizations/${org}/members/${memberId}`, {
    json: {
      role,
    },
  })
}

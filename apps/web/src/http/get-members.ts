import { Role } from '@saas/auth'
import { api } from './api-client'

export interface IGetMembersRequest {
  org: string
}

export interface IGetMembersResponse {
  members: {
    id: string
    userId: string
    name: string
    email: string
    role: Role
    avatarUrl: string | null
  }[]
}

export const getMembers = async ({
  org,
}: IGetMembersRequest): Promise<IGetMembersResponse> => {
  const members = await api
    .get(`organizations/${org}/members`, {
      next: {
        tags: [`${org}/members`],
      },
    })
    .json<IGetMembersResponse>()

  return members
}

import { api } from './api-client'

export interface IRemoveMemberRequest {
  org: string
  memberId: string
}

export const removeMember = async ({
  org,
  memberId,
}: IRemoveMemberRequest): Promise<void> => {
  await api.delete(`organizations/${org}/members/${memberId}`)
}

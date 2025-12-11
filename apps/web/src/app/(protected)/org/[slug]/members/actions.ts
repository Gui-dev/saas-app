import { getCurrentOrganization } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'
import { revalidateTag } from 'next/cache'

interface IRemoveMemberActionRequest {
  memberId: string
}

export const removeMemberAction = async ({
  memberId,
}: IRemoveMemberActionRequest) => {
  const currentOrg = await getCurrentOrganization()
  await removeMember({ org: currentOrg!, memberId })

  revalidateTag(`${currentOrg}/members`, 'max')
}

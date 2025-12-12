'use server'

import { getCurrentOrganization } from '@/auth/auth'
import { removeMember } from '@/http/remove-member'
import { updateMember } from '@/http/update-member'
import { Role } from '@saas/auth'
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

interface IUpdateMemberActionRequest {
  memberId: string
  role: Role
}

export const updateMemberAction = async ({
  memberId,
  role,
}: IUpdateMemberActionRequest) => {
  const currentOrg = await getCurrentOrganization()
  await updateMember({ org: currentOrg!, memberId, role })

  revalidateTag(`${currentOrg}/members`, 'max')
}

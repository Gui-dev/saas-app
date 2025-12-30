'use server'

import { revalidateTag } from 'next/cache'

import { acceptInvite } from '@/http/accept-invite'
import { rejectInvite } from '@/http/reject-invite'

export const acceptInviteAction = async (inviteId: string) => {
  await acceptInvite({ inviteId })
  revalidateTag('organizations', 'max')
}

export const rejectInviteAction = async (inviteId: string) => {
  await rejectInvite({ inviteId })
  revalidateTag('organizations', 'max')
}

'use server'

import { type Role, rolesSchema } from '@saas/auth'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getCurrentOrganization } from '@/auth/auth'
import { createInvite } from '@/http/create-invite'
import { removeMember } from '@/http/remove-member'
import { revokeInvite } from '@/http/revoke-invite'
import { updateMember } from '@/http/update-member'

const createInviteSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  role: rolesSchema,
})

export const createInviteAction = async (data: FormData) => {
  const result = createInviteSchema.safeParse(Object.fromEntries(data))
  const orgSlug = (await getCurrentOrganization())!

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, role } = result.data
  try {
    await createInvite({ org: orgSlug, email, role })
    revalidateTag(`${orgSlug}/invites`, 'max')
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message:
        'Ocorreu um erro ao tentar enviar um convite, tente novamente mais tarde',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Convite enviado com sucesso',
    errors: null,
  }
}

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

interface IRevokeInviteActionRequest {
  inviteId: string
}

export const revokeInviteAction = async ({
  inviteId,
}: IRevokeInviteActionRequest) => {
  const currentOrg = await getCurrentOrganization()
  await revokeInvite({ org: currentOrg!, inviteId })

  revalidateTag(`${currentOrg}/invites`, 'max')
}

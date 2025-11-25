import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const isAuthenticated = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('saas-token')
  return !!token
}

export const getCurrentOrganization = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('org')?.value ?? null
}

export const getCurrentMembership = async () => {
  const org = await getCurrentOrganization()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export const ability = async () => {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export const auth = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('saas-token')

  if (!token) {
    redirect('/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch (error) {
    redirect('/api/auth/sign-out')
  }
}

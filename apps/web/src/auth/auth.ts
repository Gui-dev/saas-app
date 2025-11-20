import { getProfile } from '@/http/get-profile'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const isAuthenticated = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('saas-token')

  return !!token
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

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const cookieStore = await cookies()

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = '/sign-in'

  cookieStore.delete('saas-token')

  return NextResponse.redirect(redirectUrl)
}

import { redirect } from 'next/navigation'

import { Header } from '@/components/header'
import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await isAuthenticated())) {
    redirect('/sign-in')
  }

  return <>{children}</>
}

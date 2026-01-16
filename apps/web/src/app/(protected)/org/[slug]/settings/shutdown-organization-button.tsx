import { XCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { shutdownOrganization } from '@/http/shutdown-organization'

export const ShutdownOrganizationButton = () => {
  const shutdownOrganizationAction = async () => {
    'use server'

    const currentOrg = await getCurrentOrganization()
    await shutdownOrganization({ org: currentOrg! })

    redirect('/')
  }
  return (
    <form action={shutdownOrganizationAction}>
      <Button
        type="submit"
        variant="destructive"
        className="w-56 cursor-pointer"
      >
        <XCircle className="mr-2 size-4" />
        Deletar organização
      </Button>
    </form>
  )
}

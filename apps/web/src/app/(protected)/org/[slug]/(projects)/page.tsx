import { ability, getCurrentOrganization } from '@/auth/auth'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProjectList } from './project-list'

const OrganizationDetails = async () => {
  const currentOrg = await getCurrentOrganization()
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {permissions?.can('create', 'Project') && (
          <Button size="sm" asChild>
            <Link href={`/org/${currentOrg}/create-project`}>
              <Plus className="size-4" />
              Criar Projeto
            </Link>
          </Button>
        )}
      </div>

      {permissions?.can('get', 'Project') && <ProjectList />}

      {permissions?.cannot('get', 'Project') && (
        <div>
          <p className="text-sm text-muted-foreground">
            Você não tem permissão para ver os projetos dessa organização
          </p>
        </div>
      )}
    </div>
  )
}

export default OrganizationDetails

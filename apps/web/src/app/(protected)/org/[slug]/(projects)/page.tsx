import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ability, getCurrentOrganization } from '@/auth/auth'
import { Button } from '@/components/ui/button'
import { ProjectList } from './project-list'

const OrganizationDetails = async () => {
  const currentOrg = await getCurrentOrganization()
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Projects</h1>
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
          <p className="text-muted-foreground text-sm">
            Você não tem permissão para ver os projetos dessa organização
          </p>
        </div>
      )}
    </div>
  )
}

export default OrganizationDetails

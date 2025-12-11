import { ability, getCurrentOrganization } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShutdownOrganizationButton } from './shutdown-organization-button'
import { OrganizationForm } from '../../organization-form'
import { getOrganization } from '@/http/get-organization'
import { Billing } from './billing'

const Settings = async () => {
  const currentOrg = await getCurrentOrganization()
  const permissions = await ability()
  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBillings = permissions?.can('get', 'Billing')
  const canShutdownOrganization = permissions?.can('delete', 'Organization')

  const { organization } = await getOrganization({ org: currentOrg! })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Configurar orgnizações</CardTitle>
              <CardDescription>
                Atualize os detalhes da sua orgnização
              </CardDescription>
            </CardHeader>

            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{
                  name: organization.name,
                  domain: organization.domain,
                  shouldAttachUsersByDomain:
                    organization.shouldAttachUsersByDomain,
                }}
              />
            </CardContent>
          </Card>
        )}

        {canGetBillings && <Billing />}

        {canShutdownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Deletar orgnização</CardTitle>
              <CardDescription>
                Isso irá apagar todos os dados da organização incluindo todos os
                projetos. Você não poderá desfazer essa operação.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Settings

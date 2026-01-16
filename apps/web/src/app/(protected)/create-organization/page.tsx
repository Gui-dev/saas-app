import { Header } from '@/components/header'
import { OrganizationForm } from '../org/organization-form'

const CreateOrganization = () => {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="font-bold text-2xl">Criar uma nova organizacao</h1>

        <OrganizationForm />
      </main>
    </div>
  )
}

export default CreateOrganization

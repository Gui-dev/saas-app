import { Header } from '@/components/header'
import { OrganizationForm } from '../org/organization-form'

const CreateOrganization = () => {
  return (
    <div className="py-4 space-y-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Criar uma nova organizacao</h1>

        <OrganizationForm />
      </main>
    </div>
  )
}

export default CreateOrganization

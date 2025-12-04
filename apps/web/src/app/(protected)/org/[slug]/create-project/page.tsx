import { Header } from '@/components/header'
import { ProjectForm } from './project-form'
import { ability } from '@/auth/auth'
import { redirect } from 'next/navigation'

const CreateProject = async () => {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Criar um novo projeto</h1>

      <ProjectForm />
    </div>
  )
}

export default CreateProject

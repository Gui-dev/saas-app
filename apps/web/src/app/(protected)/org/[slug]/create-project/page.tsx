import { redirect } from 'next/navigation'
import { ability } from '@/auth/auth'
import { ProjectForm } from './project-form'

const CreateProject = async () => {
  const permissions = await ability()

  if (permissions?.cannot('create', 'Project')) {
    redirect('/')
  }

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl">Criar um novo projeto</h1>

      <ProjectForm />
    </div>
  )
}

export default CreateProject

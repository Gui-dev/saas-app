import { ProjectRepository } from '../repositories/project-repository'
import {
  CreateProjectUseCase,
  ICreateProjectUseCaseRequest,
} from '../use-case/create-project'

export const makeCreateProject = async ({
  userId,
  organizationId,
  name,
  description,
  slug,
}: ICreateProjectUseCaseRequest) => {
  const projectRepository = new ProjectRepository()
  const createProjectUseCase = new CreateProjectUseCase(projectRepository)
  const { projectId } = await createProjectUseCase.execute({
    userId,
    organizationId,
    name,
    description,
    slug,
  })

  return {
    projectId,
  }
}

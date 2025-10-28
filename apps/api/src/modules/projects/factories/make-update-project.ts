import { ProjectRepository } from '../repositories/project-repository'
import {
  IUpdateProjectUseCaseRequest,
  UpdateProjectUseCase,
} from '../use-case/update-project'

export const makeUpdateProject = async ({
  userId,
  projectId,
  name,
  description,
}: IUpdateProjectUseCaseRequest) => {
  const projectRepository = new ProjectRepository()
  const updateProjectUseCase = new UpdateProjectUseCase(projectRepository)
  const project = await updateProjectUseCase.execute({
    userId,
    projectId,
    name,
    description,
  })

  return {
    projectId: project.projectId,
  }
}

import { ProjectRepository } from '../repositories/project-repository'
import {
  GetProjectsUseCase,
  IGetProjectsUseCaseRequest,
} from '../use-case/get-projects'

export const makeGetProjects = async ({
  organizationId,
}: IGetProjectsUseCaseRequest) => {
  const projectRepository = new ProjectRepository()
  const getProjectsUseCase = new GetProjectsUseCase(projectRepository)
  const { projects } = await getProjectsUseCase.execute({
    organizationId,
  })

  return {
    projects,
  }
}

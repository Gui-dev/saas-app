import { ProjectRepository } from '../repositories/project-repository'
import {
  DeleteProjectUseCase,
  type IDeleteProjectUseCaseRequest,
} from '../use-case/delete-project'

export const makeDeleteProject = async ({
  projectId,
  ownerId,
}: IDeleteProjectUseCaseRequest) => {
  const projectRepository = new ProjectRepository()
  const deleteProjectUseCase = new DeleteProjectUseCase(projectRepository)
  await deleteProjectUseCase.execute({ projectId, ownerId })
}

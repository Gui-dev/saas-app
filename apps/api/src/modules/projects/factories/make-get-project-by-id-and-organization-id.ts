import { ProjectRepository } from '../repositories/project-repository'
import {
  GetProjectByIdAndOrganizationIdUseCase,
  IGetProjectByIdAndOrganizationIdRequest,
} from '../use-case/get-project-by-id-and-organization-id'

export const makeGetProjectByIdAndOrganizationId = async ({
  projectId,
  organizationId,
}: IGetProjectByIdAndOrganizationIdRequest) => {
  const projectRepository = new ProjectRepository()
  const getProjectByIdAndOrganizationIdUseCase =
    new GetProjectByIdAndOrganizationIdUseCase(projectRepository)
  const project = await getProjectByIdAndOrganizationIdUseCase.execute({
    projectId,
    organizationId,
  })

  return {
    project,
  }
}

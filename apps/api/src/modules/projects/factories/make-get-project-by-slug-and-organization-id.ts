import { ProjectRepository } from '../repositories/project-repository'
import {
  GetProjectBySlugAndOrganizationIdUseCase,
  type IGetProjectBySlugAndOrganizationIdUseCaseRequest,
} from '../use-case/get-project-by-slug-and-organization-id'

export const makeGetProjectBySlugAndOrganizationId = async ({
  projectSlug,
  organizationId,
}: IGetProjectBySlugAndOrganizationIdUseCaseRequest) => {
  const projectRepository = new ProjectRepository()
  const getProjectBySlugAndOrganizationIdUseCase =
    new GetProjectBySlugAndOrganizationIdUseCase(projectRepository)
  const { project } = await getProjectBySlugAndOrganizationIdUseCase.execute({
    projectSlug,
    organizationId,
  })

  return {
    project,
  }
}

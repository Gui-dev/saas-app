import { BadRequestError } from '@/http/_errors/bad-request-error'
import {
  IGetProjectBySlugAndOrganizationIdResponse,
  IProjectRepositoryContract,
} from '../contracts/project-repository-contract'
import { Project } from '@/generated/prisma'

export interface IGetProjectBySlugAndOrganizationIdUseCaseRequest {
  projectSlug: string
  organizationId: string
}

export interface IGetProjectBySlugAndOrganizationIdUseCaseResponse {
  project: IGetProjectBySlugAndOrganizationIdResponse
}

export class GetProjectBySlugAndOrganizationIdUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({
    projectSlug,
    organizationId,
  }: IGetProjectBySlugAndOrganizationIdUseCaseRequest): Promise<IGetProjectBySlugAndOrganizationIdUseCaseResponse> {
    const project =
      await this.projectRepository.findByProjectSlugAndOrganizationId({
        projectSlug,
        organizationId,
      })

    if (!project) {
      throw new BadRequestError('Project not found')
    }

    return {
      project,
    }
  }
}

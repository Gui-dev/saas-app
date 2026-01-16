import type { Project } from '@/generated/prisma'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IProjectRepositoryContract } from '../contracts/project-repository-contract'

export interface IGetProjectByIdAndOrganizationIdRequest {
  projectId: string
  organizationId: string
}

export interface IGetProjectByIdAndOrganizationIdResponse {
  project: Project
}

export class GetProjectByIdAndOrganizationIdUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({
    projectId,
    organizationId,
  }: IGetProjectByIdAndOrganizationIdRequest): Promise<IGetProjectByIdAndOrganizationIdResponse> {
    const project =
      await this.projectRepository.findByProjectIdAndOrganizationId({
        projectId,
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

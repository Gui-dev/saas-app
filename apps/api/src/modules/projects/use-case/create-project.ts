import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IProjectRepositoryContract } from '../contracts/project-repository-contract'

export interface ICreateProjectUseCaseRequest {
  userId: string
  organizationId: string
  name: string
  description: string
}

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({
    userId,
    organizationId,
    name,
    description,
  }: ICreateProjectUseCaseRequest) {
    const project = await this.projectRepository.create({
      userId,
      organizationId,
      name,
      description,
    })

    if (!project) {
      throw new BadRequestError('Error creating project')
    }

    return {
      projectId: project.id,
    }
  }
}

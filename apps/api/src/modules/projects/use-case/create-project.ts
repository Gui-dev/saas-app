import { BadRequestError } from '@/http/_errors/bad-request-error'
import { IProjectRepositoryContract } from '../contracts/project-repository-contract'

export interface ICreateProjectUseCaseRequest {
  userId: string
  organizationId: string
  name: string
  description: string
  slug: string
}

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({
    userId,
    organizationId,
    name,
    description,
    slug,
  }: ICreateProjectUseCaseRequest) {
    const project = await this.projectRepository.create({
      userId,
      organizationId,
      name,
      description,
      slug,
    })

    if (!project) {
      throw new BadRequestError('Error creating project')
    }

    return {
      projectId: project.id,
    }
  }
}

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { IProjectRepositoryContract } from '../contracts/project-repository-contract'

export interface IUpdateProjectUseCaseRequest {
  userId: string
  projectId: string
  name: string
  description: string
}

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({
    userId,
    projectId,
    name,
    description,
  }: IUpdateProjectUseCaseRequest) {
    const project = await this.projectRepository.update({
      ownerId: userId,
      projectId,
      data: {
        name,
        description,
      },
    })

    if (!project) {
      throw new BadRequestError('Error creating project')
    }

    return {
      projectId: project.id,
    }
  }
}

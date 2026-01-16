import type { IProjectRepositoryContract } from '../contracts/project-repository-contract'

export interface IDeleteProjectUseCaseRequest {
  projectId: string
  ownerId: string
}

export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({ projectId, ownerId }: IDeleteProjectUseCaseRequest) {
    await this.projectRepository.delete({ projectId, ownerId })
  }
}

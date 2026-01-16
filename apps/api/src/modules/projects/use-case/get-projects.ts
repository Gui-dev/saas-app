import type {
  IFindAllProjectsByOrganizationIdResponse,
  IProjectRepositoryContract,
} from '../contracts/project-repository-contract'

export interface IGetProjectsUseCaseRequest {
  organizationId: string
}

export interface IGetProjectByIdAndOrganizationIdResponse {
  projects: IFindAllProjectsByOrganizationIdResponse[]
}

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepositoryContract) {}

  public async execute({
    organizationId,
  }: IGetProjectsUseCaseRequest): Promise<IGetProjectByIdAndOrganizationIdResponse> {
    const projects =
      await this.projectRepository.findAllProjectsByOrganizationId(
        organizationId
      )

    return {
      projects,
    }
  }
}

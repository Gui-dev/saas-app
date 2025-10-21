import { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'

export interface IGetOrganizationsUseCaseRequest {
  userId: string
}

export class GetOrganizationsUseCase {
  constructor(
    private organizationRepository: IOrganizationRepositoryContract
  ) {}

  public async execute({ userId }: IGetOrganizationsUseCaseRequest) {
    const organizations =
      await this.organizationRepository.getOrganizationsByUserId(userId)

    return {
      organizations,
    }
  }
}

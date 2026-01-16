import type { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'

export interface IShutdownOrganizationUseCaseRequest {
  organizationId: string
}

export class ShutdownOrganizationUseCase {
  constructor(
    private organizationRepository: IOrganizationRepositoryContract
  ) {}

  public async execute({
    organizationId,
  }: IShutdownOrganizationUseCaseRequest): Promise<void> {
    await this.organizationRepository.delete(organizationId)
  }
}

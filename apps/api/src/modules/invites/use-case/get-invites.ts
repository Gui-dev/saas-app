import type { IInviteRepositoryContract } from '../contracts/invite-repository-contract'

export interface IGetInvitesUseCaseRequest {
  organizationId: string
}

export class GetInvitesUseCase {
  constructor(private readonly inviteRepository: IInviteRepositoryContract) {}

  public async execute({ organizationId }: IGetInvitesUseCaseRequest) {
    const invites =
      await this.inviteRepository.findByOrganizationId(organizationId)

    return {
      invites,
    }
  }
}

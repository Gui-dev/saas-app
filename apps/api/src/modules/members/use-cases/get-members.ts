import type { IMemberRepositoryContract } from '../contracts/member-repository-contract'

export interface IGetMembersUseCaseRequest {
  organizationId: string
}

export class GetMembersUseCase {
  constructor(private memberRepository: IMemberRepositoryContract) {}

  public async execute({ organizationId }: IGetMembersUseCaseRequest) {
    const members =
      await this.memberRepository.findByOrganizationId(organizationId)

    return {
      members,
    }
  }
}

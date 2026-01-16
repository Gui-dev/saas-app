import type { IMemberRepositoryContract } from '@/modules/members/contracts/member-repository-contract'
import type { IProjectRepositoryContract } from '@/modules/projects/contracts/project-repository-contract'

export interface IGetOrganizationBillingUseCaseRequest {
  organizationId: string
}

export class GetOrganizationBillingUseCase {
  constructor(
    private memberRepository: IMemberRepositoryContract,
    private projectRepository: IProjectRepositoryContract
  ) {}

  public async execute({
    organizationId,
  }: IGetOrganizationBillingUseCaseRequest) {
    const [amountOfMembers, amountOfProjects] = await Promise.all([
      this.memberRepository.count(organizationId),
      this.projectRepository.count(organizationId),
    ])

    return {
      billing: {
        seats: {
          amount: amountOfMembers,
          unit: 10,
          price: amountOfMembers * 10,
        },
        projects: {
          amount: amountOfProjects,
          unit: 20,
          price: amountOfProjects * 20,
        },
        total: amountOfMembers * 10 + amountOfProjects * 20,
      },
    }
  }
}

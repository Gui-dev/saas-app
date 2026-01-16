import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'

export interface IUpdateOrganizationUseCaseRequest {
  domain: string | undefined
  organizationId: string
  name: string
  shouldAttachUsersByDomain: boolean | undefined
}

export class UpdateOrganizationUseCase {
  constructor(
    private organizationRepository: IOrganizationRepositoryContract
  ) {}

  public async execute({
    domain,
    organizationId,
    name,
    shouldAttachUsersByDomain,
  }: IUpdateOrganizationUseCaseRequest) {
    if (domain) {
      const organizationByDomain =
        await this.organizationRepository.getOrganizationByDomainAndNotOrganizationId(
          {
            domain,
            organizationId,
          }
        )

      if (organizationByDomain) {
        throw new BadRequestError(
          'Another Organization with the same domain already exists'
        )
      }
    }

    await this.organizationRepository.update({
      organizationId,
      data: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
  }
}

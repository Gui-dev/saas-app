import { BadRequestError } from '@/http/_errors/bad-request-error'
import { createSlug } from '@/utils/create-slug'
import type { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'

export interface ICreateOrganizationUseCaseRequest {
  ownerId: string
  name: string
  domain: string | undefined
  shouldAttachUsersByDomain: boolean
}

export class CreateOrganizationUseCase {
  constructor(
    private organizationRepository: IOrganizationRepositoryContract
  ) {}

  public async execute({
    ownerId,
    name,
    domain,
    shouldAttachUsersByDomain,
  }: ICreateOrganizationUseCaseRequest) {
    if (domain) {
      const organizationByDomain =
        await this.organizationRepository.findByDomain(domain)

      if (organizationByDomain) {
        throw new BadRequestError(
          'Another Organization with the same domain already exists'
        )
      }
    }

    const organization = await this.organizationRepository.create({
      ownerId,
      name,
      domain,
      slug: createSlug(name),
      shouldAttachUsersByDomain,
    })

    return {
      organizationId: organization.id,
    }
  }
}

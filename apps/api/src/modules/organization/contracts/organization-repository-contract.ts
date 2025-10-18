import type { Organization } from '@/generated/prisma'

export interface ICreateOrganization {
  ownerId: string
  name: string
  slug: string
  domain?: string
  avatarUrl?: string
  shouldAttachUsersByDomain: boolean
}

export interface IOrganizationRepositoryContract {
  findByDomain(domain: string): Promise<Organization | null>
  findByDomainAndAttachUsersByDomain(
    domain: string
  ): Promise<Organization | null>
  create(data: ICreateOrganization): Promise<Organization>
}

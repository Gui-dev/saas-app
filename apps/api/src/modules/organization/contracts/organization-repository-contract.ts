import type { Organization, Prisma } from '@/generated/prisma'

export interface ICreateOrganization {
  ownerId: string
  name: string
  slug: string
  domain?: string
  avatarUrl?: string
  shouldAttachUsersByDomain: boolean
}

export type GetOrganizationsByUserIdResponse = Prisma.OrganizationGetPayload<{
  select: {
    id: true
    name: true
    slug: true
    avatarUrl: true
    members: {
      select: {
        role: true
      }
    }
  }
}>

export interface IOrganizationRepositoryContract {
  findByDomain(domain: string): Promise<Organization | null>
  findByDomainAndAttachUsersByDomain(
    domain: string
  ): Promise<Organization | null>
  getOrganizationsByUserId(
    userId: string
  ): Promise<GetOrganizationsByUserIdResponse[]>
  create(data: ICreateOrganization): Promise<Organization>
}

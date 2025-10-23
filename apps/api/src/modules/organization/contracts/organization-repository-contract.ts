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

export interface IGetOrganizationByDomainAndNotOrganizationIdRequest {
  domain: string
  organizationId: string
}

export interface IUpdateOrganization {
  organizationId: string
  data: Partial<Omit<Organization, 'id' | 'members' | 'slug' | 'createdAt'>>
}

export interface IOrganizationRepositoryContract {
  findByDomain(domain: string): Promise<Organization | null>
  findByDomainAndAttachUsersByDomain(
    domain: string
  ): Promise<Organization | null>
  getOrganizationsByUserId(
    userId: string
  ): Promise<GetOrganizationsByUserIdResponse[]>
  getOrganizationByDomainAndNotOrganizationId({
    domain,
    organizationId,
  }: IGetOrganizationByDomainAndNotOrganizationIdRequest): Promise<Organization | null>
  create(data: ICreateOrganization): Promise<Organization>
  update(data: IUpdateOrganization): Promise<Organization>
  delete(organizationId: string): Promise<Organization | null>
}

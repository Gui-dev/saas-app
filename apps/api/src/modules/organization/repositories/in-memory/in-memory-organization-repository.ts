import { randomUUID } from 'node:crypto'
import type { Organization } from '@/generated/prisma'
import type {
  GetOrganizationsByUserIdResponse,
  ICreateOrganization,
  IGetOrganizationByDomainAndNotOrganizationIdRequest,
  IOrganizationRepositoryContract,
  IUpdateOrganization,
} from '../../contracts/organization-repository-contract'

export class InMemoryOrganizationRepository
  implements IOrganizationRepositoryContract
{
  private items: Organization[] = []

  public async findByDomain(domain: string): Promise<Organization | null> {
    const organization = this.items.find(item => item.domain === domain)

    if (!organization) {
      return null
    }

    return organization
  }

  public async findByDomainAndAttachUsersByDomain(
    domain: string
  ): Promise<Organization | null> {
    const organization = this.items.find(
      item => item.domain === domain && item.shouldAttachUsersByDomain
    )

    if (!organization) {
      return null
    }

    return organization
  }

  public async create(data: ICreateOrganization): Promise<Organization> {
    const organization = {
      id: randomUUID(),
      ownerId: data.ownerId,
      name: data.name,
      slug: data.slug,
      domain: data.domain || '',
      avatarUrl: data.avatarUrl || '',
      shouldAttachUsersByDomain: data.shouldAttachUsersByDomain,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(organization)

    return organization
  }

  public async getOrganizationsByUserId(
    userId: string
  ): Promise<GetOrganizationsByUserIdResponse[]> {
    const organizations = this.items.filter(item =>
      item.members?.some(
        (member: { userId: string }) => member.userId === userId
      )
    )

    return organizations.map(organization => ({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      avatarUrl: organization.avatarUrl,
      members: organization.members
        ? organization.members
            .filter((member: { userId: string }) => member.userId === userId)
            .map((member: { role: string }) => ({ role: member.role }))
        : [],
    }))
  }

  public async getOrganizationByDomainAndNotOrganizationId({
    domain,
    organizationId,
  }: IGetOrganizationByDomainAndNotOrganizationIdRequest): Promise<Organization | null> {
    const organization = this.items.find(
      item => item.domain === domain && item.id !== organizationId
    )

    if (!organization) {
      return null
    }

    return organization
  }

  public async update({
    organizationId,
    data,
  }: IUpdateOrganization): Promise<Organization> {
    const organizationIndex = this.items.findIndex(
      item => item.id === organizationId
    )

    if (organizationIndex === -1) {
      throw new Error('Organization not found')
    }

    const updatedOrganization: Organization = {
      ...this.items[organizationIndex],
      ...data,
      updatedAt: new Date(),
    }

    this.items[organizationIndex] = updatedOrganization

    return updatedOrganization
  }

  public async delete(organizationId: string): Promise<Organization | null> {
    const organizationIndex = this.items.findIndex(
      item => item.id === organizationId
    )

    if (organizationIndex === -1) {
      return null
    }

    const [deletedOrganization] = this.items.splice(organizationIndex, 1)

    return deletedOrganization
  }

  public getItems(): Organization[] {
    return this.items
  }

  public setItems(items: Organization[]) {
    this.items = items
  }
}

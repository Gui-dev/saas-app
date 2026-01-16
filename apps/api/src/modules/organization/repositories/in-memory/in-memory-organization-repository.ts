import { randomUUID } from 'node:crypto'
import type { Organization } from '@/generated/prisma'
import type {
  ICreateOrganization,
  IOrganizationRepositoryContract,
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

  public getItems(): Organization[] {
    return this.items
  }

  public setItems(items: Organization[]) {
    this.items = items
  }
}

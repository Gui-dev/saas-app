import { Organization } from '@/generated/prisma'
import { IOrganizationRepositoryContract } from '../../contracts/organization-repository-contract'

export class InMemoryOrganizationRepository
  implements IOrganizationRepositoryContract
{
  private items: Organization[] = []

  public async findByDomain(domain: string): Promise<Organization | null> {
    const organization = this.items.find(
      item => item.domain === domain && item.shouldAttachUsersByDomain
    )

    if (!organization) {
      return null
    }

    return organization
  }

  public getItems(): Organization[] {
    return this.items
  }

  public setItems(items: Organization[]) {
    this.items = items
  }
}

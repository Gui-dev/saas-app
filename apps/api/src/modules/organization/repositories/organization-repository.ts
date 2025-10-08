import type { Organization } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import type { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'

export class OrganizationRepository implements IOrganizationRepositoryContract {
  async findByDomain(domain: string): Promise<Organization | null> {
    const organization = await prisma.organization.findFirst({
      where: {
        domain,
        shouldAttachUsersByDomain: true,
      },
    })

    return organization
  }
}

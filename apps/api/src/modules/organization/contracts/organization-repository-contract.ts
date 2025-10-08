import type { Organization } from '@/generated/prisma'

export interface IOrganizationRepositoryContract {
  findByDomain(domain: string): Promise<Organization | null>
}

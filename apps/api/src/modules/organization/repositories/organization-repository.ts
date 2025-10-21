import type { Organization } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  GetOrganizationsByUserIdResponse,
  ICreateOrganization,
  IOrganizationRepositoryContract,
} from '../contracts/organization-repository-contract'

export class OrganizationRepository implements IOrganizationRepositoryContract {
  public async findByDomain(domain: string): Promise<Organization | null> {
    const organization = await prisma.organization.findFirst({
      where: {
        domain,
      },
    })

    return organization
  }

  public async findByDomainAndAttachUsersByDomain(
    domain: string
  ): Promise<Organization | null> {
    const organization = await prisma.organization.findFirst({
      where: {
        domain,
        shouldAttachUsersByDomain: true,
      },
    })

    return organization
  }

  public async getOrganizationsByUserId(
    userId: string
  ): Promise<GetOrganizationsByUserIdResponse[]> {
    const organization = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        avatarUrl: true,
        members: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    })

    return organization
  }

  public async create(data: ICreateOrganization): Promise<Organization> {
    const organization = await prisma.organization.create({
      data: {
        ...data,
        members: {
          create: {
            userId: data.ownerId,
            role: 'ADMIN',
          },
        },
      },
    })

    return organization
  }
}

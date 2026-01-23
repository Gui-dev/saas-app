import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Organization, User } from '@/generated/prisma'
import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { GetOrganizationsUseCase } from './get-organizations'

describe('GetOrganizationsUseCase', () => {
  let organizationRepository: InMemoryOrganizationRepository
  let sut: GetOrganizationsUseCase

  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new GetOrganizationsUseCase(organizationRepository)
  })

  it('should return organizations for user', async () => {
    const userId = randomUUID()

    const organizations: Organization[] = [
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization A',
        slug: 'organization-a',
        domain: 'org-a.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar-a.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [{ userId, role: 'MEMBER' }],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization B',
        slug: 'organization-b',
        domain: 'org-b.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar-b.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          { userId: randomUUID(), role: 'OWNER' }, // different user
        ],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization C',
        slug: 'organization-c',
        domain: 'org-c.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar-c.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [{ userId, role: 'ADMIN' }],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
    ]

    organizationRepository.setItems(organizations)

    const result = await sut.execute({ userId })

    expect(result.organizations).toHaveLength(2)
    expect(result.organizations).toEqual([
      {
        id: organizations[0].id,
        name: 'Organization A',
        slug: 'organization-a',
        avatarUrl: 'https://example.com/avatar-a.png',
        members: [{ role: 'MEMBER' }],
      },
      {
        id: organizations[2].id,
        name: 'Organization C',
        slug: 'organization-c',
        avatarUrl: 'https://example.com/avatar-c.png',
        members: [{ role: 'ADMIN' }],
      },
    ])
  })

  it('should return empty array when user has no organizations', async () => {
    const userId = randomUUID()

    const organizations: Organization[] = [
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization D',
        slug: 'organization-d',
        domain: 'org-d.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar-d.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          { userId: randomUUID(), role: 'OWNER' }, // different user
        ],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
    ]

    organizationRepository.setItems(organizations)

    const result = await sut.execute({ userId })

    expect(result.organizations).toHaveLength(0)
    expect(result.organizations).toEqual([])
  })

  it('should return multiple organizations for user with different roles', async () => {
    const userId = randomUUID()

    const organizations: Organization[] = [
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization 1',
        slug: 'organization-1',
        domain: 'org1.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar1.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          { userId, role: 'OWNER' },
          { userId: randomUUID(), role: 'MEMBER' },
        ],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization 2',
        slug: 'organization-2',
        domain: 'org2.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar2.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [{ userId, role: 'ADMIN' }],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
      {
        id: randomUUID(),
        ownerId: randomUUID(),
        name: 'Organization 3',
        slug: 'organization-3',
        domain: 'org3.com',
        shouldAttachUsersByDomain: false,
        avatarUrl: 'https://example.com/avatar3.png',
        createdAt: new Date(),
        updatedAt: new Date(),
        members: [
          { userId, role: 'MEMBER' },
          { userId, role: 'ADMIN' }, // multiple roles? but probably unique, but test anyway
        ],
        invites: [],
        owner: { id: randomUUID() } as User,
        projects: [],
      },
    ]

    organizationRepository.setItems(organizations)

    const result = await sut.execute({ userId })

    expect(result.organizations).toHaveLength(3)
    expect(result.organizations).toEqual([
      {
        id: organizations[0].id,
        name: 'Organization 1',
        slug: 'organization-1',
        avatarUrl: 'https://example.com/avatar1.png',
        members: [{ role: 'OWNER' }],
      },
      {
        id: organizations[1].id,
        name: 'Organization 2',
        slug: 'organization-2',
        avatarUrl: 'https://example.com/avatar2.png',
        members: [{ role: 'ADMIN' }],
      },
      {
        id: organizations[2].id,
        name: 'Organization 3',
        slug: 'organization-3',
        avatarUrl: 'https://example.com/avatar3.png',
        members: [{ role: 'MEMBER' }, { role: 'ADMIN' }],
      },
    ])
  })
})

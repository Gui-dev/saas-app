import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryMemberRepository } from '@/modules/members/repositories/in-memory/in-memory-member-repository'
import { InMemoryProjectRepository } from '@/modules/projects/repositories/in-memory/in-memory-project-repository'
import { GetOrganizationBillingUseCase } from './get-organization-billing'

describe('GetOrganizationBillingUseCase', () => {
  let memberRepository: InMemoryMemberRepository
  let projectRepository: InMemoryProjectRepository
  let sut: GetOrganizationBillingUseCase

  beforeEach(() => {
    memberRepository = new InMemoryMemberRepository()
    projectRepository = new InMemoryProjectRepository()
    sut = new GetOrganizationBillingUseCase(memberRepository, projectRepository)
  })

  const createMember = (organizationId: string, userId?: string) => {
    const member = {
      id: randomUUID(),
      userId: userId || randomUUID(),
      organizationId,
      role: 'MEMBER' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: userId || randomUUID(),
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: '',
      },
    }
    memberRepository.setItems([...memberRepository.getItems(), member])
    return member
  }

  const createProject = (organizationId: string, ownerId?: string) => {
    const project = {
      id: randomUUID(),
      ownerId: ownerId || randomUUID(),
      organizationId,
      name: 'Test Project',
      description: 'Test Description',
      slug: `test-project-${randomUUID().slice(0, 8)}`,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    projectRepository.setItems([...projectRepository.getItems(), project])
    return project
  }

  it('should return billing with zero values when organization has no members or projects', async () => {
    // Arrange
    const organizationId = randomUUID()

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.billing).toEqual({
      seats: {
        amount: 0,
        unit: 10,
        price: 0,
      },
      projects: {
        amount: 0,
        unit: 20,
        price: 0,
      },
      total: 0,
    })
  })

  it('should calculate correct billing for multiple members only', async () => {
    // Arrange
    const organizationId = randomUUID()

    // Create 3 members
    createMember(organizationId)
    createMember(organizationId)
    createMember(organizationId)

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.billing).toEqual({
      seats: {
        amount: 3,
        unit: 10,
        price: 30,
      },
      projects: {
        amount: 0,
        unit: 20,
        price: 0,
      },
      total: 30,
    })
  })

  it('should calculate correct billing for multiple projects only', async () => {
    // Arrange
    const organizationId = randomUUID()
    const ownerId = randomUUID()

    // Create 2 projects
    createProject(organizationId, ownerId)
    createProject(organizationId, ownerId)

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.billing).toEqual({
      seats: {
        amount: 0,
        unit: 10,
        price: 0,
      },
      projects: {
        amount: 2,
        unit: 20,
        price: 40,
      },
      total: 40,
    })
  })

  it('should calculate correct billing for both members and projects', async () => {
    // Arrange
    const organizationId = randomUUID()
    const userId = randomUUID()
    const ownerId = randomUUID()

    // Create 5 members and 3 projects
    for (let i = 0; i < 5; i++) {
      createMember(organizationId, userId)
    }
    for (let i = 0; i < 3; i++) {
      createProject(organizationId, ownerId)
    }

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.billing).toEqual({
      seats: {
        amount: 5,
        unit: 10,
        price: 50,
      },
      projects: {
        amount: 3,
        unit: 20,
        price: 60,
      },
      total: 110,
    })
  })

  it('should calculate correct billing for single member and project', async () => {
    // Arrange
    const organizationId = randomUUID()
    const userId = randomUUID()
    const ownerId = randomUUID()

    // Create 1 member and 1 project
    createMember(organizationId, userId)
    createProject(organizationId, ownerId)

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.billing).toEqual({
      seats: {
        amount: 1,
        unit: 10,
        price: 10,
      },
      projects: {
        amount: 1,
        unit: 20,
        price: 20,
      },
      total: 30,
    })
  })

  it('should only count members and projects from specific organization', async () => {
    // Arrange
    const organizationId = randomUUID()
    const otherOrganizationId = randomUUID()

    // Create members in both organizations
    createMember(organizationId) // 1 member in target org
    createMember(otherOrganizationId) // 1 member in other org
    createMember(otherOrganizationId) // 1 member in other org

    // Create projects in both organizations
    createProject(organizationId) // 1 project in target org
    createProject(otherOrganizationId) // 1 project in other org

    // Act
    const result = await sut.execute({ organizationId })

    // Assert - Should only count from target organization
    expect(result.billing).toEqual({
      seats: {
        amount: 1,
        unit: 10,
        price: 10,
      },
      projects: {
        amount: 1,
        unit: 20,
        price: 20,
      },
      total: 30,
    })
  })
})

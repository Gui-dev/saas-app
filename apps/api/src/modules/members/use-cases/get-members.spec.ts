import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Member } from '@/generated/prisma'

import { InMemoryMemberRepository } from '../repositories/in-memory/in-memory-member-repository'
import { GetMembersUseCase } from './get-members'

describe('GetMembersUseCase', () => {
  let memberRepository: InMemoryMemberRepository
  let sut: GetMembersUseCase

  beforeEach(() => {
    memberRepository = new InMemoryMemberRepository()
    sut = new GetMembersUseCase(memberRepository)
  })

  it('should return members for an organization', async () => {
    // Arrange
    const organizationId = randomUUID()
    const userId1 = randomUUID()
    const userId2 = randomUUID()

    // Add members to the organization
    const member1: Member = {
      id: randomUUID(),
      organizationId,
      userId: userId1,
      role: 'ADMIN',
      user: {
        id: userId1,
        name: 'Admin User',
        email: 'admin@example.com',
        avatarUrl: '',
      },
    }

    const member2: Member = {
      id: randomUUID(),
      organizationId,
      userId: userId2,
      role: 'MEMBER',
      user: {
        id: userId2,
        name: 'Regular User',
        email: 'user@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member1, member2])

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.members).toHaveLength(2)
    expect(result.members[0].id).toBe(member1.id)
    expect(result.members[1].id).toBe(member2.id)
  })

  it('should return empty array for organization with no members', async () => {
    // Arrange
    const organizationId = randomUUID()

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.members).toHaveLength(0)
  })

  it('should return empty array for non-existent organization', async () => {
    // Arrange
    const nonExistentOrganizationId = randomUUID()

    // Act
    const result = await sut.execute({
      organizationId: nonExistentOrganizationId,
    })

    // Assert
    expect(result.members).toHaveLength(0)
  })

  it('should return only members for the specified organization', async () => {
    // Arrange
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const userId = randomUUID()

    // Add member to first organization
    const member1: Member = {
      id: randomUUID(),
      organizationId: organizationId1,
      userId,
      role: 'ADMIN',
      user: {
        id: userId,
        name: 'User',
        email: 'user@example.com',
        avatarUrl: '',
      },
    }

    // Add member to second organization
    const member2: Member = {
      id: randomUUID(),
      organizationId: organizationId2,
      userId: randomUUID(),
      role: 'MEMBER',
      user: {
        id: randomUUID(),
        name: 'Other User',
        email: 'other@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member1, member2])

    // Act - Get members for first organization only
    const result = await sut.execute({ organizationId: organizationId1 })

    // Assert
    expect(result.members).toHaveLength(1)
    expect(result.members[0].id).toBe(member1.id)
  })
})

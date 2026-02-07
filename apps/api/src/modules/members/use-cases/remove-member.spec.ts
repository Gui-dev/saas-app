import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Member } from '@/generated/prisma'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryMemberRepository } from '../repositories/in-memory/in-memory-member-repository'
import { RemoveMemberUseCase } from './remove-member'

describe('RemoveMemberUseCase', () => {
  let memberRepository: InMemoryMemberRepository
  let sut: RemoveMemberUseCase

  beforeEach(() => {
    memberRepository = new InMemoryMemberRepository()
    sut = new RemoveMemberUseCase(memberRepository)
  })

  it('should remove a member successfully', async () => {
    // Arrange
    const organizationId = randomUUID()
    const memberId = randomUUID()
    const userId = randomUUID()

    const member: Member = {
      id: memberId,
      organizationId,
      userId,
      role: 'MEMBER',
      user: {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member])

    // Act
    await sut.execute({ memberId, organizationId })

    // Assert
    const members = memberRepository.getItems()
    expect(members).toHaveLength(0)
  })

  it('should throw BadRequestError when member does not exist', async () => {
    // Arrange
    const nonExistentMemberId = randomUUID()
    const organizationId = randomUUID()

    // Act & Assert
    await expect(
      sut.execute({ memberId: nonExistentMemberId, organizationId })
    ).rejects.toThrow(BadRequestError)
  })

  it('should remove only the specified member when multiple exist', async () => {
    // Arrange
    const organizationId = randomUUID()
    const memberId1 = randomUUID()
    const memberId2 = randomUUID()

    const member1: Member = {
      id: memberId1,
      organizationId,
      userId: randomUUID(),
      role: 'MEMBER',
      user: {
        id: randomUUID(),
        name: 'User 1',
        email: 'user1@example.com',
        avatarUrl: '',
      },
    }

    const member2: Member = {
      id: memberId2,
      organizationId,
      userId: randomUUID(),
      role: 'ADMIN',
      user: {
        id: randomUUID(),
        name: 'User 2',
        email: 'user2@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member1, member2])

    // Act - Remove first member
    await sut.execute({ memberId: memberId1, organizationId })

    // Assert
    const members = memberRepository.getItems()
    expect(members).toHaveLength(1)
    expect(members[0].id).toBe(memberId2)
  })

  it('should handle removal from different organizations correctly', async () => {
    // Arrange
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const memberId = randomUUID()

    const member1: Member = {
      id: memberId,
      organizationId: organizationId1,
      userId: randomUUID(),
      role: 'MEMBER',
      user: {
        id: randomUUID(),
        name: 'User',
        email: 'user@example.com',
        avatarUrl: '',
      },
    }

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

    // Act - Remove member from first organization
    await sut.execute({ memberId, organizationId: organizationId1 })

    // Assert
    const members = memberRepository.getItems()
    expect(members).toHaveLength(1)
    expect(members[0].organizationId).toBe(organizationId2)
  })
})

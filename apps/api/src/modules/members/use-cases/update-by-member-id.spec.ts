import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Member } from '@/generated/prisma'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryMemberRepository } from '../repositories/in-memory/in-memory-member-repository'
import { UpdateByMemberIdUseCase } from './update-by-member-id'

describe('UpdateByMemberIdUseCase', () => {
  let memberRepository: InMemoryMemberRepository
  let sut: UpdateByMemberIdUseCase

  beforeEach(() => {
    memberRepository = new InMemoryMemberRepository()
    sut = new UpdateByMemberIdUseCase(memberRepository)
  })

  it('should update member role from MEMBER to ADMIN successfully', async () => {
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
    const result = await sut.execute({
      memberId,
      organizationId,
      role: 'ADMIN',
    })

    // Assert
    expect(result).toEqual({ memberId })

    const updatedMember = memberRepository.getItems()[0]
    expect(updatedMember.role).toBe('ADMIN')
    expect(updatedMember.id).toBe(memberId)
  })

  it('should update member role from ADMIN to BILLING successfully', async () => {
    // Arrange
    const organizationId = randomUUID()
    const memberId = randomUUID()
    const userId = randomUUID()

    const member: Member = {
      id: memberId,
      organizationId,
      userId,
      role: 'ADMIN',
      user: {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member])

    // Act
    const result = await sut.execute({
      memberId,
      organizationId,
      role: 'BILLING',
    })

    // Assert
    expect(result).toEqual({ memberId })

    const updatedMember = memberRepository.getItems()[0]
    expect(updatedMember.role).toBe('BILLING')
  })

  it('should update member role from BILLING to MEMBER successfully', async () => {
    // Arrange
    const organizationId = randomUUID()
    const memberId = randomUUID()
    const userId = randomUUID()

    const member: Member = {
      id: memberId,
      organizationId,
      userId,
      role: 'BILLING',
      user: {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member])

    // Act
    const result = await sut.execute({
      memberId,
      organizationId,
      role: 'MEMBER',
    })

    // Assert
    expect(result).toEqual({ memberId })

    const updatedMember = memberRepository.getItems()[0]
    expect(updatedMember.role).toBe('MEMBER')
  })

  it('should throw BadRequestError when member does not exist', async () => {
    // Arrange
    const nonExistentMemberId = randomUUID()
    const organizationId = randomUUID()

    // Act & Assert
    await expect(
      sut.execute({
        memberId: nonExistentMemberId,
        organizationId,
        role: 'ADMIN',
      })
    ).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError when member exists but in different organization', async () => {
    // Arrange
    const memberId = randomUUID()
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const userId = randomUUID()

    const member: Member = {
      id: memberId,
      organizationId: organizationId1,
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

    // Act & Assert - Try to update with different organization
    await expect(
      sut.execute({ memberId, organizationId: organizationId2, role: 'ADMIN' })
    ).rejects.toThrow(BadRequestError)
  })

  it('should update only the specified member when multiple exist', async () => {
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

    // Act - Update first member
    await sut.execute({ memberId: memberId1, organizationId, role: 'BILLING' })

    // Assert
    const members = memberRepository.getItems()
    expect(members).toHaveLength(2)

    const updatedMember1 = members.find(m => m.id === memberId1)
    const updatedMember2 = members.find(m => m.id === memberId2)

    expect(updatedMember1?.role).toBe('BILLING')
    expect(updatedMember2?.role).toBe('ADMIN') // Should remain unchanged
  })

  it('should handle updates from different organizations correctly', async () => {
    // Arrange
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const memberId1 = randomUUID()
    const memberId2 = randomUUID()

    const member1: Member = {
      id: memberId1,
      organizationId: organizationId1,
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
      organizationId: organizationId2,
      userId: randomUUID(),
      role: 'MEMBER',
      user: {
        id: randomUUID(),
        name: 'User 2',
        email: 'user2@example.com',
        avatarUrl: '',
      },
    }

    memberRepository.setItems([member1, member2])

    // Act - Update member from first organization
    await sut.execute({
      memberId: memberId1,
      organizationId: organizationId1,
      role: 'ADMIN',
    })

    // Assert
    const members = memberRepository.getItems()
    expect(members).toHaveLength(2)

    const updatedMember1 = members.find(m => m.id === memberId1)
    const updatedMember2 = members.find(m => m.id === memberId2)

    expect(updatedMember1?.role).toBe('ADMIN') // Should be updated
    expect(updatedMember2?.role).toBe('MEMBER') // Should remain unchanged
  })
})

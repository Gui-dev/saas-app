import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Member } from '@/generated/prisma'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryMemberRepository } from '@/modules/members/repositories/in-memory/in-memory-member-repository'
import { InMemoryInviteRepository } from '../repositories/in-memory/in-memory-invite-repository'
import { CreateInviteUseCase } from './create-invite'

describe('CreateInviteUseCase', () => {
  let inviteRepository: InMemoryInviteRepository
  let memberRepository: InMemoryMemberRepository
  let sut: CreateInviteUseCase

  beforeEach(() => {
    inviteRepository = new InMemoryInviteRepository()
    memberRepository = new InMemoryMemberRepository()
    sut = new CreateInviteUseCase(inviteRepository, memberRepository)
  })

  it('should create an invite successfully', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const email = 'test@example.com'
    const role: 'ADMIN' | 'MEMBER' | 'BILLING' = 'MEMBER'

    // Act
    const result = await sut.execute({ organizationId, authorId, email, role })

    // Assert
    expect(result.inviteId).toBeDefined()
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(1)
    expect(invites[0].email).toBe(email)
    expect(invites[0].organizationId).toBe(organizationId)
    expect(invites[0].authorId).toBe(authorId)
    expect(invites[0].role).toBe(role)
  })

  it('should throw BadRequestError when invite with same email already exists', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const email = 'existing@example.com'

    await inviteRepository.create({
      organizationId,
      authorId,
      email,
      role: 'MEMBER',
    })

    // Act & Assert
    await expect(
      sut.execute({ organizationId, authorId, email, role: 'MEMBER' })
    ).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError when member with same email already exists', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const email = 'member@example.com'

    // Add a member with the same email
    const member: Member = {
      id: randomUUID(),
      organizationId,
      userId: randomUUID(),
      role: 'MEMBER',
      user: {
        id: randomUUID(),
        name: 'Existing Member',
        email,
        avatarUrl: '',
      },
    }
    memberRepository.setItems([member])

    // Act & Assert
    await expect(
      sut.execute({ organizationId, authorId, email, role: 'MEMBER' })
    ).rejects.toThrow(BadRequestError)
  })

  it('should allow creating invite with different email even if other invites exist', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    // Create existing invite
    await inviteRepository.create({
      organizationId,
      authorId,
      email: 'existing@example.com',
      role: 'MEMBER',
    })

    // Act - Create invite with different email
    const result = await sut.execute({
      organizationId,
      authorId,
      email: 'new@example.com',
      role: 'ADMIN',
    })

    // Assert
    expect(result.inviteId).toBeDefined()
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(2)
  })

  it('should allow creating invite with same email for different organizations', async () => {
    // Arrange
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const authorId = randomUUID()
    const email = 'test@example.com'

    // Create invite for first organization
    await inviteRepository.create({
      organizationId: organizationId1,
      authorId,
      email,
      role: 'MEMBER',
    })

    // Act - Create invite for second organization with same email
    const result = await sut.execute({
      organizationId: organizationId2,
      authorId,
      email,
      role: 'MEMBER',
    })

    // Assert
    expect(result.inviteId).toBeDefined()
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(2)
  })
})

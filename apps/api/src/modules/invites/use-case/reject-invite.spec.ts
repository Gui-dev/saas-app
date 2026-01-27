import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryInviteRepository } from '@/modules/invites/repositories/in-memory/in-memory-invite-repository'
import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { RejectInviteUseCase } from './reject-invite'

describe('RejectInviteUseCase', () => {
  let inviteRepository: InMemoryInviteRepository
  let userRepository: InMemoryUserRepository
  let sut: RejectInviteUseCase

  beforeEach(() => {
    inviteRepository = new InMemoryInviteRepository()
    userRepository = new InMemoryUserRepository()
    sut = new RejectInviteUseCase(inviteRepository, userRepository)
  })

  it('should reject an invite successfully', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const email = 'test@example.com'

    // Create an invite
    const createdInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email,
      role: 'MEMBER',
    })

    // Create a user with matching email
    const createdUser = await userRepository.create({
      name: 'Test User',
      email,
      password: 'password123',
    })

    // Act
    await sut.execute({ inviteId: createdInvite.id, userId: createdUser.id })

    // Assert
    // The invite should be removed from the repository
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(0)
  })

  it('should throw BadRequestError when invite does not exist', async () => {
    // Arrange
    const nonExistentInviteId = randomUUID()
    const userId = randomUUID()

    // Act & Assert
    await expect(
      sut.execute({ inviteId: nonExistentInviteId, userId })
    ).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError when user does not exist', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const nonExistentUserId = randomUUID()
    const email = 'test@example.com'

    // Create an invite
    const createdInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email,
      role: 'MEMBER',
    })

    // Act & Assert
    await expect(
      sut.execute({ inviteId: createdInvite.id, userId: nonExistentUserId })
    ).rejects.toThrow(BadRequestError)
  })

  it('should throw BadRequestError when invite email does not match user email', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const userId = randomUUID()

    // Create an invite with one email
    const createdInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email: 'invite@example.com',
      role: 'MEMBER',
    })

    // Create a user with different email
    await userRepository.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'password123',
    })

    // Act & Assert
    await expect(
      sut.execute({ inviteId: createdInvite.id, userId })
    ).rejects.toThrow(BadRequestError)
  })

  it('should reject invite only when email matches exactly', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const email = 'test@example.com'

    // Create an invite
    const createdInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email,
      role: 'ADMIN',
    })

    // Create a user with exact matching email
    const createdUser = await userRepository.create({
      name: 'Test User',
      email,
      password: 'password123',
    })

    // Act
    await sut.execute({ inviteId: createdInvite.id, userId: createdUser.id })

    // Assert
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(0)
  })
})

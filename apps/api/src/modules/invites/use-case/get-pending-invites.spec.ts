import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { InMemoryInviteRepository } from '../repositories/in-memory/in-memory-invite-repository'
import { GetPendingInvitesUseCase } from './get-pending-invites'

describe('GetPendingInvitesUseCase', () => {
  let inviteRepository: InMemoryInviteRepository
  let userRepository: InMemoryUserRepository
  let sut: GetPendingInvitesUseCase

  beforeEach(() => {
    inviteRepository = new InMemoryInviteRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GetPendingInvitesUseCase(inviteRepository, userRepository)
  })

  it('should return pending invites for a user', async () => {
    // Arrange
    const userId = randomUUID()
    const email = 'test@example.com'

    // Create a user
    const createdUser = await userRepository.create({
      name: 'Test User',
      email,
      password: 'password123',
    })

    // Create invites for the user
    await inviteRepository.create({
      organizationId: randomUUID(),
      authorId: randomUUID(),
      email,
      role: 'MEMBER',
    })

    await inviteRepository.create({
      organizationId: randomUUID(),
      authorId: randomUUID(),
      email,
      role: 'ADMIN',
    })

    // Act
    const result = await sut.execute({ userId: createdUser.id })

    // Assert
    expect(result.invites).toHaveLength(2)
    expect(result.invites[0].email).toBe(email)
    expect(result.invites[1].email).toBe(email)
  })

  it('should return empty array for user with no pending invites', async () => {
    // Arrange
    const userId = randomUUID()
    const email = 'test@example.com'

    // Create a user
    const createdUser = await userRepository.create({
      name: 'Test User',
      email,
      password: 'password123',
    })

    // Act
    const result = await sut.execute({ userId: createdUser.id })

    // Assert
    expect(result.invites).toHaveLength(0)
  })

  it('should throw BadRequestError when user does not exist', async () => {
    // Arrange
    const nonExistentUserId = randomUUID()

    // Act & Assert
    await expect(sut.execute({ userId: nonExistentUserId })).rejects.toThrow(
      BadRequestError
    )
  })

  it('should return only invites for the specified user', async () => {
    // Arrange
    const userId1 = randomUUID()
    const _userId2 = randomUUID()

    // Create first user
    const createdUser1 = await userRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      password: 'password123',
    })

    // Create second user
    await userRepository.create({
      name: 'User 2',
      email: 'user2@example.com',
      password: 'password123',
    })

    // Create invites for first user
    await inviteRepository.create({
      organizationId: randomUUID(),
      authorId: randomUUID(),
      email: 'user1@example.com',
      role: 'MEMBER',
    })

    // Create invites for second user
    await inviteRepository.create({
      organizationId: randomUUID(),
      authorId: randomUUID(),
      email: 'user2@example.com',
      role: 'ADMIN',
    })

    // Act - Get invites for first user only
    const result = await sut.execute({ userId: createdUser1.id })

    // Assert
    expect(result.invites).toHaveLength(1)
    expect(result.invites[0].email).toBe('user1@example.com')
  })

  it('should return invites with proper organization and author data', async () => {
    // Arrange
    const userId = randomUUID()
    const email = 'test@example.com'
    const organizationId = randomUUID()
    const authorId = randomUUID()

    // Create a user
    const createdUser = await userRepository.create({
      name: 'Test User',
      email,
      password: 'password123',
    })

    // Create an invite
    await inviteRepository.create({
      organizationId,
      authorId,
      email,
      role: 'BILLING',
    })

    // Act
    const result = await sut.execute({ userId: createdUser.id })

    // Assert
    expect(result.invites).toHaveLength(1)
    expect(result.invites[0].organization.id).toBe(organizationId)
    expect(result.invites[0].author.id).toBe(authorId)
    expect(result.invites[0].createdAt).toBeInstanceOf(Date)
  })
})

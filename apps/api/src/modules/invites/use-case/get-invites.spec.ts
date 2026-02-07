import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryInviteRepository } from '../repositories/in-memory/in-memory-invite-repository'
import { GetInvitesUseCase } from './get-invites'

describe('GetInvitesUseCase', () => {
  let inviteRepository: InMemoryInviteRepository
  let sut: GetInvitesUseCase

  beforeEach(() => {
    inviteRepository = new InMemoryInviteRepository()
    sut = new GetInvitesUseCase(inviteRepository)
  })

  it('should return invites for an organization', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    // Create multiple invites for the organization
    await inviteRepository.create({
      organizationId,
      authorId,
      email: 'test1@example.com',
      role: 'MEMBER',
    })

    await inviteRepository.create({
      organizationId,
      authorId,
      email: 'test2@example.com',
      role: 'ADMIN',
    })

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.invites).toHaveLength(2)
    expect(result.invites[0].email).toBe('test1@example.com')
    expect(result.invites[1].email).toBe('test2@example.com')
  })

  it('should return empty array for organization with no invites', async () => {
    // Arrange
    const organizationId = randomUUID()

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.invites).toHaveLength(0)
  })

  it('should return empty array for non-existent organization', async () => {
    // Arrange
    const nonExistentOrganizationId = randomUUID()

    // Act
    const result = await sut.execute({
      organizationId: nonExistentOrganizationId,
    })

    // Assert
    expect(result.invites).toHaveLength(0)
  })

  it('should return only invites for the specified organization', async () => {
    // Arrange
    const organizationId1 = randomUUID()
    const organizationId2 = randomUUID()
    const authorId = randomUUID()

    // Create invites for first organization
    await inviteRepository.create({
      organizationId: organizationId1,
      authorId,
      email: 'org1@example.com',
      role: 'MEMBER',
    })

    // Create invites for second organization
    await inviteRepository.create({
      organizationId: organizationId2,
      authorId,
      email: 'org2@example.com',
      role: 'ADMIN',
    })

    // Act - Get invites for first organization only
    const result = await sut.execute({ organizationId: organizationId1 })

    // Assert
    expect(result.invites).toHaveLength(1)
    expect(result.invites[0].email).toBe('org1@example.com')
  })

  it('should return invites with proper author data', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    await inviteRepository.create({
      organizationId,
      authorId,
      email: 'test@example.com',
      role: 'BILLING',
    })

    // Act
    const result = await sut.execute({ organizationId })

    // Assert
    expect(result.invites).toHaveLength(1)
    expect(result.invites[0].author.id).toBe(authorId)
    expect(result.invites[0].createdAt).toBeInstanceOf(Date)
  })
})

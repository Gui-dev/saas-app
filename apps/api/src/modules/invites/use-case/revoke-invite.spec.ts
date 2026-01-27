import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryInviteRepository } from '@/modules/invites/repositories/in-memory/in-memory-invite-repository'
import { RevokeInviteUseCase } from './revoke-invite'

describe('RevokeInviteUseCase', () => {
  let inviteRepository: InMemoryInviteRepository
  let sut: RevokeInviteUseCase

  beforeEach(() => {
    inviteRepository = new InMemoryInviteRepository()
    sut = new RevokeInviteUseCase(inviteRepository)
  })

  it('should revoke an invite successfully', async () => {
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

    // Act
    await sut.execute({ inviteId: createdInvite.id })

    // Assert
    // The invite should be removed from the repository
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(0)
  })

  it('should throw BadRequestError when invite does not exist', async () => {
    // Arrange
    const nonExistentInviteId = randomUUID()

    // Act & Assert
    await expect(
      sut.execute({ inviteId: nonExistentInviteId })
    ).rejects.toThrow(BadRequestError)
  })

  it('should revoke invite when multiple invites exist', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    const invite1 = await inviteRepository.create({
      organizationId,
      authorId,
      email: 'test1@example.com',
      role: 'MEMBER',
    })

    const invite2 = await inviteRepository.create({
      organizationId,
      authorId,
      email: 'test2@example.com',
      role: 'ADMIN',
    })

    // Act - Revoke the first invite
    await sut.execute({ inviteId: invite1.id })

    // Assert
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(1)
    expect(invites[0].id).toBe(invite2.id)
    expect(invites[0].email).toBe('test2@example.com')
  })

  it('should revoke invite regardless of role', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    const adminInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email: 'admin@example.com',
      role: 'ADMIN',
    })

    // Act
    await sut.execute({ inviteId: adminInvite.id })

    // Assert
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(0)
  })

  it('should revoke invite with BILLING role', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    const billingInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email: 'billing@example.com',
      role: 'BILLING',
    })

    // Act
    await sut.execute({ inviteId: billingInvite.id })

    // Assert
    const invites = inviteRepository.getItems()
    expect(invites).toHaveLength(0)
  })
})

import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryInviteRepository } from '../repositories/in-memory/in-memory-invite-repository'
import { GetInviteUseCase } from './get-invite'

describe('GetInviteUseCase', () => {
  let inviteRepository: InMemoryInviteRepository
  let sut: GetInviteUseCase

  beforeEach(() => {
    inviteRepository = new InMemoryInviteRepository()
    sut = new GetInviteUseCase(inviteRepository)
  })

  it('should return an invite successfully', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()
    const email = 'test@example.com'

    const createdInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email,
      role: 'MEMBER',
    })

    // Act
    const result = await sut.execute({ inviteId: createdInvite.id })

    // Assert
    expect(result.invite).toBeDefined()
    expect(result.invite?.id).toBe(createdInvite.id)
    expect(result.invite?.email).toBe(email)
    expect(result.invite?.role).toBe('MEMBER')
  })

  it('should throw BadRequestError when invite does not exist', async () => {
    // Arrange
    const nonExistentInviteId = randomUUID()

    // Act & Assert
    await expect(
      sut.execute({ inviteId: nonExistentInviteId })
    ).rejects.toThrow(BadRequestError)
  })

  it('should return the correct invite when multiple exist', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    const invite1 = await inviteRepository.create({
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

    // Act - Get the first invite
    const result = await sut.execute({ inviteId: invite1.id })

    // Assert
    expect(result.invite).toBeDefined()
    expect(result.invite?.id).toBe(invite1.id)
    expect(result.invite?.email).toBe('test1@example.com')
    expect(result.invite?.role).toBe('MEMBER')
  })

  it('should return invite with proper author and organization data', async () => {
    // Arrange
    const organizationId = randomUUID()
    const authorId = randomUUID()

    const createdInvite = await inviteRepository.create({
      organizationId,
      authorId,
      email: 'test@example.com',
      role: 'BILLING',
    })

    // Act
    const result = await sut.execute({ inviteId: createdInvite.id })

    // Assert
    expect(result.invite).toBeDefined()
    expect(result.invite?.author.id).toBe(authorId)
    expect(result.invite?.organization.id).toBe(organizationId)
    expect(result.invite?.createdAt).toBeInstanceOf(Date)
  })
})

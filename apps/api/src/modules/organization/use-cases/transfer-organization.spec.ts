import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Member } from '@/generated/prisma'

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryMemberRepository } from '@/modules/members/repositories/in-memory/in-memory-member-repository'
import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { TransferOrganizationUseCase } from './transfer-organization'

describe('TransferOrganizationUseCase', () => {
  let organizationRepository: InMemoryOrganizationRepository
  let memberRepository: InMemoryMemberRepository
  let sut: TransferOrganizationUseCase

  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    memberRepository = new InMemoryMemberRepository()
    sut = new TransferOrganizationUseCase(
      organizationRepository,
      memberRepository
    )
  })

  it('should transfer organization ownership successfully', async () => {
    // Arrange
    const ownerId = randomUUID()
    const newOwnerId = randomUUID()

    const organization = await organizationRepository.create({
      ownerId,
      name: 'Test Organization',
      slug: 'test-organization',
      shouldAttachUsersByDomain: false,
    })

    // Add the new owner as a member
    const member: Member = {
      id: randomUUID(),
      organizationId: organization.id,
      userId: newOwnerId,
      role: 'MEMBER',
      user: {
        id: newOwnerId,
        name: 'New Owner',
        email: 'newowner@example.com',
        avatarUrl: '',
      },
    }
    memberRepository.setItems([member])

    // Act
    await sut.execute({
      organizationId: organization.id,
      transferToUserId: newOwnerId,
    })

    // Assert
    const updatedOrganization = await organizationRepository.findByDomain(
      organization.domain || ''
    )
    expect(updatedOrganization?.ownerId).toBe(newOwnerId)

    const updatedMember = await memberRepository.findByOrganizationIdAndUserId({
      organizationId: organization.id,
      userId: newOwnerId,
    })
    expect(updatedMember?.role).toBe('ADMIN')
  })

  it('should throw BadRequestError when target user is not a member', async () => {
    // Arrange
    const ownerId = randomUUID()
    const nonMemberId = randomUUID()

    const organization = await organizationRepository.create({
      ownerId,
      name: 'Test Organization',
      slug: 'test-organization',
      shouldAttachUsersByDomain: false,
    })

    // Act & Assert
    await expect(
      sut.execute({
        organizationId: organization.id,
        transferToUserId: nonMemberId,
      })
    ).rejects.toThrow(BadRequestError)
  })

  it('should update both organization owner and member role atomically', async () => {
    // Arrange
    const ownerId = randomUUID()
    const newOwnerId = randomUUID()

    const organization = await organizationRepository.create({
      ownerId,
      name: 'Test Organization',
      slug: 'test-organization',
      shouldAttachUsersByDomain: false,
    })

    // Add the new owner as a member
    const member: Member = {
      id: randomUUID(),
      organizationId: organization.id,
      userId: newOwnerId,
      role: 'MEMBER',
      user: {
        id: newOwnerId,
        name: 'New Owner',
        email: 'newowner@example.com',
        avatarUrl: '',
      },
    }
    memberRepository.setItems([member])

    // Act
    await sut.execute({
      organizationId: organization.id,
      transferToUserId: newOwnerId,
    })

    // Assert - Both should be updated
    const updatedOrganization = await organizationRepository.findByDomain(
      organization.domain || ''
    )
    const updatedMember = await memberRepository.findByOrganizationIdAndUserId({
      organizationId: organization.id,
      userId: newOwnerId,
    })

    expect(updatedOrganization?.ownerId).toBe(newOwnerId)
    expect(updatedMember?.role).toBe('ADMIN')
  })
})

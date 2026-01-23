import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { ShutdownOrganizationUseCase } from './shutdown-organization'

describe('ShutdownOrganizationUseCase', () => {
  let organizationRepository: InMemoryOrganizationRepository
  let sut: ShutdownOrganizationUseCase

  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new ShutdownOrganizationUseCase(organizationRepository)
  })

  it('should delete an organization successfully', async () => {
    // Arrange
    const ownerId = randomUUID()
    const organization = await organizationRepository.create({
      ownerId,
      name: 'Test Organization',
      slug: 'test-organization',
      shouldAttachUsersByDomain: false,
    })

    // Act
    await sut.execute({ organizationId: organization.id })

    // Assert
    const organizations = organizationRepository.getItems()
    expect(organizations).toHaveLength(0)
  })

  it('should handle deletion of non-existent organization gracefully', async () => {
    // Arrange
    const nonExistentOrganizationId = randomUUID()

    // Act
    await sut.execute({ organizationId: nonExistentOrganizationId })

    // Assert
    const organizations = organizationRepository.getItems()
    expect(organizations).toHaveLength(0)
  })

  it('should delete the correct organization when multiple exist', async () => {
    // Arrange
    const ownerId = randomUUID()
    const organization1 = await organizationRepository.create({
      ownerId,
      name: 'Organization 1',
      slug: 'organization-1',
      shouldAttachUsersByDomain: false,
    })

    const organization2 = await organizationRepository.create({
      ownerId,
      name: 'Organization 2',
      slug: 'organization-2',
      shouldAttachUsersByDomain: false,
    })

    // Act
    await sut.execute({ organizationId: organization1.id })

    // Assert
    const organizations = organizationRepository.getItems()
    expect(organizations).toHaveLength(1)
    expect(organizations[0].id).toBe(organization2.id)
    expect(organizations[0].name).toBe('Organization 2')
  })
})


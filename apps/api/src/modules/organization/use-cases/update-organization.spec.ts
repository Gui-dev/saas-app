import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { UpdateOrganizationUseCase } from './update-organization'

describe('UpdateOrganizationUseCase', () => {
  let organizationRepository: InMemoryOrganizationRepository
  let sut: UpdateOrganizationUseCase

  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new UpdateOrganizationUseCase(organizationRepository)
  })

  it('should update organization name successfully', async () => {
    const initialName = 'Old Name'

    const createdOrg = await organizationRepository.create({
      ownerId: randomUUID(),
      name: initialName,
      slug: 'old-name',
      domain: undefined,
      shouldAttachUsersByDomain: false,
    })

    const organizationId = createdOrg.id
    const newName = 'New Name'

    await sut.execute({
      organizationId,
      name: newName,
      domain: undefined,
      shouldAttachUsersByDomain: undefined,
    })

    const organizations = organizationRepository.getItems()
    const updatedOrganization = organizations.find(o => o.id === organizationId)

    expect(updatedOrganization).toBeDefined()
    expect(updatedOrganization?.name).toBe(newName)
  })

  it('should update organization with unique domain successfully', async () => {
    const initialName = 'Old Name'

    const createdOrg = await organizationRepository.create({
      ownerId: randomUUID(),
      name: initialName,
      slug: 'old-name',
      domain: undefined,
      shouldAttachUsersByDomain: false,
    })

    const organizationId = createdOrg.id
    const newName = 'New Name'
    const newDomain = 'unique-domain.com'

    await sut.execute({
      organizationId,
      name: newName,
      domain: newDomain,
      shouldAttachUsersByDomain: undefined,
    })

    const organizations = organizationRepository.getItems()
    const updatedOrganization = organizations.find(o => o.id === organizationId)

    expect(updatedOrganization).toBeDefined()
    expect(updatedOrganization?.name).toBe(newName)
    expect(updatedOrganization?.domain).toBe(newDomain)
  })

  it('should throw BadRequestError when domain already exists for another organization', async () => {
    const existingDomain = 'existing-domain.com'

    const _firstOrg = await organizationRepository.create({
      ownerId: randomUUID(),
      name: 'First Organization',
      slug: 'first-organization',
      domain: existingDomain,
      shouldAttachUsersByDomain: false,
    })

    const secondOrg = await organizationRepository.create({
      ownerId: randomUUID(),
      name: 'Second Organization',
      slug: 'second-organization',
      domain: undefined,
      shouldAttachUsersByDomain: false,
    })

    await expect(
      sut.execute({
        organizationId: secondOrg.id,
        name: 'Updated Name',
        domain: existingDomain,
        shouldAttachUsersByDomain: undefined,
      })
    ).rejects.toThrow(
      'Another Organization with the same domain already exists'
    )
  })

  it('should update all fields successfully', async () => {
    const initialName = 'Old Name'

    const createdOrg = await organizationRepository.create({
      ownerId: randomUUID(),
      name: initialName,
      slug: 'old-name',
      domain: undefined,
      shouldAttachUsersByDomain: false,
    })

    const organizationId = createdOrg.id
    const newName = 'Updated Name'
    const newDomain = 'new-domain.com'
    const newShouldAttachUsersByDomain = true

    await sut.execute({
      organizationId,
      name: newName,
      domain: newDomain,
      shouldAttachUsersByDomain: newShouldAttachUsersByDomain,
    })

    const organizations = organizationRepository.getItems()
    const updatedOrganization = organizations.find(o => o.id === organizationId)

    expect(updatedOrganization).toBeDefined()
    expect(updatedOrganization?.name).toBe(newName)
    expect(updatedOrganization?.domain).toBe(newDomain)
    expect(updatedOrganization?.shouldAttachUsersByDomain).toBe(
      newShouldAttachUsersByDomain
    )
  })
})

import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrganizationRepository } from '../repositories/in-memory/in-memory-organization-repository'
import { CreateOrganizationUseCase } from './create-organization'

describe('CreateOrganizationUseCase', () => {
  let organizationRepository: InMemoryOrganizationRepository
  let sut: CreateOrganizationUseCase

  beforeEach(() => {
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new CreateOrganizationUseCase(organizationRepository)
  })

  it('should create an organization successfully', async () => {
    const ownerId = randomUUID()
    const name = 'My Organization'
    const domain = undefined
    const shouldAttachUsersByDomain = false

    const result = await sut.execute({
      ownerId,
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    expect(result.organizationId).toBeDefined()

    const organizations = organizationRepository.getItems()
    expect(organizations).toHaveLength(1)
    expect(organizations[0].name).toBe(name)
    expect(organizations[0].ownerId).toBe(ownerId)
  })

  it('should throw BadRequestError when domain already exists', async () => {
    const ownerId = randomUUID()
    const domain = 'existing-domain.com'

    await organizationRepository.create({
      ownerId: randomUUID(),
      name: 'Existing Organization',
      slug: 'existing-organization',
      domain,
      shouldAttachUsersByDomain: false,
    })

    await expect(
      sut.execute({
        ownerId,
        name: 'New Organization',
        domain,
        shouldAttachUsersByDomain: false,
      })
    ).rejects.toThrow(
      'Another Organization with the same domain already exists'
    )
  })

  it('should create organization with domain when domain is unique', async () => {
    const ownerId = randomUUID()
    const name = 'My Organization'
    const domain = 'unique-domain.com'
    const shouldAttachUsersByDomain = true

    const result = await sut.execute({
      ownerId,
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    expect(result.organizationId).toBeDefined()

    const organizations = organizationRepository.getItems()
    expect(organizations).toHaveLength(1)
    expect(organizations[0].domain).toBe(domain)
    expect(organizations[0].shouldAttachUsersByDomain).toBe(true)
  })

  it('should allow creating organization with same domain for different organizations when domain is undefined', async () => {
    const ownerId = randomUUID()

    await organizationRepository.create({
      ownerId,
      name: 'First Organization',
      slug: 'first-organization',
      domain: 'same-domain.com',
      shouldAttachUsersByDomain: false,
    })

    const result = await sut.execute({
      ownerId,
      name: 'Second Organization',
      domain: undefined,
      shouldAttachUsersByDomain: false,
    })

    expect(result.organizationId).toBeDefined()
    expect(organizationRepository.getItems()).toHaveLength(2)
  })

  it('should generate slug from name', async () => {
    const ownerId = randomUUID()
    const name = 'My Organization Name'

    await sut.execute({
      ownerId,
      name,
      domain: undefined,
      shouldAttachUsersByDomain: false,
    })

    const organizations = organizationRepository.getItems()
    expect(organizations[0].slug).toBe('my-organization-name')
  })
})

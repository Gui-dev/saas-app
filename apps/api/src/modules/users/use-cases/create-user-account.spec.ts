import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CreateUserAccountUseCase } from '@/modules/users/use-cases/create-user-account'
import { BadRequestError } from '@/http/_errors/bad-request-error'

import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { InMemoryOrganizationRepository } from '@/modules/organization/repositories/in-memory/in-memory-organization-repository'

let userRepository: InMemoryUserRepository
let organizationRepository: InMemoryOrganizationRepository
let sut: CreateUserAccountUseCase

vi.mock('bcryptjs', () => {
  return {
    hash: (password: string) => Promise.resolve(password),
  }
})

describe('Create User Account', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    organizationRepository = new InMemoryOrganizationRepository()
    sut = new CreateUserAccountUseCase(userRepository, organizationRepository)
  })

  it('should be able to create a new user account', async () => {
    const { id } = await sut.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    expect(id).toEqual(expect.any(String))
    expect(userRepository.getItems()).toHaveLength(1)
  })

  it('should not be able to create a user with a duplicated email', async () => {
    const { id } = await sut.execute({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    expect(id).toEqual(expect.any(String))
    expect(userRepository.getItems()).toHaveLength(1)

    await expect(() =>
      sut.execute({
        name: 'Bruce Wayne',
        email: 'bruce@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should be able to auto-join an organization if the email domain matches a registered organozation', async () => {
    const { id } = await sut.execute({
      name: 'Bruce Wayne',
      email: 'bruce@edc.com',
      password: '123456',
    })

    const organization = await organizationRepository.create({
      ownerId: id,
      name: 'DC Comics',
      domain: 'dc.com',
      slug: 'dc-comics',
      avatarUrl: '',
      shouldAttachUsersByDomain: true,
    })

    expect(userRepository.getItems()[0].id).toEqual(organization.ownerId)
    expect(organization).toHaveProperty('id')
  })
})

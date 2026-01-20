import { beforeEach, describe, expect, it } from 'vitest'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { GetProfileUseCase } from '@/modules/users/use-cases/get-profile'

let userRepository: InMemoryUserRepository
let sut: GetProfileUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetProfileUseCase(userRepository)
  })

  it('should be able to get a user profile', async () => {
    const user = await userRepository.create({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    const { user: profile } = await sut.execute({ id: user.id })

    expect(profile).toEqual(expect.any(Object))
    expect(profile.id).toEqual(user.id)
    expect(profile.name).toEqual('Bruce Wayne')
  })

  it('should not be able to get a profile with a non-existent user id', async () => {
    await expect(() =>
      sut.execute({ id: 'non-existent-id' })
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})

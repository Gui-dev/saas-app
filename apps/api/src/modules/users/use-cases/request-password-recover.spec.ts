import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTokenRepository } from '@/modules/token/repositories/in-memory/in-memory-token-repository'
import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { RequestPasswordRecoverUseCase } from '@/modules/users/use-cases/request-password-recover'

let userRepository: InMemoryUserRepository
let tokenRepository: InMemoryTokenRepository
let sut: RequestPasswordRecoverUseCase

describe('Request Password Recover', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    tokenRepository = new InMemoryTokenRepository()
    sut = new RequestPasswordRecoverUseCase(userRepository, tokenRepository)
  })

  it('should be able to request a password recover for an existing user', async () => {
    await userRepository.create({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    const result = await sut.execute('bruce@email.com')

    expect(result).not.toBeNull()
    expect(result?.tokenId).toEqual(expect.any(String))
    expect(tokenRepository.getItems()).toHaveLength(1)
  })

  it('should return null for a non-existing user', async () => {
    const result = await sut.execute('nonexistent@email.com')

    expect(result).toBeNull()
    expect(tokenRepository.getItems()).toHaveLength(0)
  })

  it('should create a token with the correct type and userId', async () => {
    const user = await userRepository.create({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    const result = await sut.execute('bruce@email.com')

    expect(result).not.toBeNull()
    expect(result?.tokenId).toEqual(expect.any(String))
    expect(tokenRepository.getItems()[0].type).toBe('PASSWORD_RECOVER')
    expect(tokenRepository.getItems()[0].userId).toBe(user.id)
  })
})

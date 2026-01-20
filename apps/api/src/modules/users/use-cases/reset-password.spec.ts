import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { InMemoryTokenRepository } from '@/modules/token/repositories/in-memory/in-memory-token-repository'
import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { ResetPasswordUseCase } from '@/modules/users/use-cases/reset-password'

let userRepository: InMemoryUserRepository
let tokenRepository: InMemoryTokenRepository
let sut: ResetPasswordUseCase

describe('Reset Password', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    tokenRepository = new InMemoryTokenRepository()
    sut = new ResetPasswordUseCase(userRepository, tokenRepository)
  })

  it('should be able to reset the password with a valid token', async () => {
    const user = await userRepository.create({
      name: 'Bruce Wayne',
      email: 'bruce@email.com',
      password: '123456',
    })

    const token = await tokenRepository.create({
      type: 'PASSWORD_RECOVER',
      userId: user.id,
    })

    const newPassword = 'newpassword123'
    await sut.execute({ code: token.id, password: newPassword })

    const updatedUser = await userRepository.findByEmail(user.email)
    const isPasswordMatch = await compare(
      newPassword,
      updatedUser?.passwordHash || ''
    )

    expect(isPasswordMatch).toBe(true)
  })

  it('should throw an UnauthorizedError if the token is invalid', async () => {
    await expect(() =>
      sut.execute({ code: 'invalid-token', password: 'newpassword123' })
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw an UnauthorizedError if the token does not exist', async () => {
    await expect(() =>
      sut.execute({ code: 'nonexistent-token', password: 'newpassword123' })
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})

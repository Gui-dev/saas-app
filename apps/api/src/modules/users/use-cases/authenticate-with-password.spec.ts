import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory/in-memory-user-repository'
import { AuthenticateWithPasswordUseCase } from './authenticate-with-password'

describe('AuthenticateWithPasswordUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository
  let sut: AuthenticateWithPasswordUseCase

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new AuthenticateWithPasswordUseCase(inMemoryUserRepository)
  })

  it('should authenticate user with valid credentials', async () => {
    const email = 'john@example.com'
    const password = 'password123'
    const passwordHash = await hash(password, 10)

    await inMemoryUserRepository.create({
      name: 'John Doe',
      email,
      password: passwordHash,
    })

    const result = await sut.execute({ email, password })

    expect(result.id).toBeDefined()
  })

  it('should throw error when user does not exist', async () => {
    await expect(
      sut.execute({
        email: 'nonexistent@example.com',
        password: 'anypassword',
      })
    ).rejects.toThrow('Invalid credentials')
  })

  it('should throw BadRequestError when user has no password (social login)', async () => {
    const email = 'social@example.com'

    await inMemoryUserRepository.create({
      name: 'Social User',
      email,
      password: null,
    })

    await expect(
      sut.execute({
        email,
        password: 'anypassword',
      })
    ).rejects.toThrow(
      'Invalid credentials. User does not have a password, use social login'
    )
  })

  it('should throw BadRequestError when password is invalid', async () => {
    const email = 'john@example.com'
    const password = 'password123'
    const passwordHash = await hash(password, 10)

    await inMemoryUserRepository.create({
      name: 'John Doe',
      email,
      password: passwordHash,
    })

    await expect(
      sut.execute({
        email,
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials')
  })
})

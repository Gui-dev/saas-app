import { beforeEach, describe, expect, it } from 'vitest'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { InMemoryAccountRepository } from '@/modules/accounts/repositories/in-memory/in-memory-account-repository'
import { InMemoryUserRepository } from '@/modules/users/repositories/in-memory/in-memory-user-repository'
import { AuthenticateWithGithubUseCase } from './authenticate-with-github'

describe('AuthenticateWithGithubUseCase', () => {
  let userRepository: InMemoryUserRepository
  let accountRepository: InMemoryAccountRepository
  let sut: AuthenticateWithGithubUseCase

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    accountRepository = new InMemoryAccountRepository()
    sut = new AuthenticateWithGithubUseCase(userRepository, accountRepository)
  })

  it('should throw BadRequestError when email is not provided', async () => {
    const request = {
      githubId: 'github-123',
      name: 'John Doe',
      email: null,
      avatar_url: 'https://github.com/avatar',
    }

    await expect(sut.execute(request)).rejects.toThrow(BadRequestError)
  })

  it('should return existing userId when user already exists', async () => {
    const existingUser = await userRepository.create({
      email: 'john@example.com',
      name: 'John Doe',
    })

    const request = {
      githubId: 'github-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: 'https://github.com/avatar',
    }

    const result = await sut.execute(request)

    expect(result.userId).toBe(existingUser.id)
    expect(userRepository.getItems()).toHaveLength(1)
  })

  it('should create new user when user does not exist', async () => {
    const request = {
      githubId: 'github-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: 'https://github.com/avatar',
    }

    const result = await sut.execute(request)

    expect(result.userId).toBeDefined()
    expect(userRepository.getItems()).toHaveLength(1)
    expect(userRepository.getItems()[0].email).toBe('john@example.com')
    expect(userRepository.getItems()[0].name).toBe('John Doe')
  })

  it('should not create new account when account already exists', async () => {
    const existingUser = await userRepository.create({
      email: 'john@example.com',
      name: 'John Doe',
    })

    await accountRepository.create({
      userId: existingUser.id,
      provider: 'GITHUB',
      providerAccountId: 'github-123',
    })

    const request = {
      githubId: 'github-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: 'https://github.com/avatar',
    }

    await sut.execute(request)

    expect(accountRepository.getItems()).toHaveLength(1)
  })

  it('should create new account when account does not exist', async () => {
    const existingUser = await userRepository.create({
      email: 'john@example.com',
      name: 'John Doe',
    })

    const request = {
      githubId: 'github-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar_url: 'https://github.com/avatar',
    }

    await sut.execute(request)

    expect(accountRepository.getItems()).toHaveLength(1)
    expect(accountRepository.getItems()[0].userId).toBe(existingUser.id)
    expect(accountRepository.getItems()[0].provider).toBe('GITHUB')
    expect(accountRepository.getItems()[0].providerAccountId).toBe('github-123')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock @saas/env before importing
vi.mock('@saas/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3333',
  },
}))

// Mock api-client
const mockPost = vi.fn()
vi.mock('./api-client', () => ({
  api: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}))

// Import after mocks
import { signUp } from './sign-up'

describe('signUp', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return user id on successful sign up', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'mock-user-id' }),
    })

    const result = await signUp({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ id: 'mock-user-id' })
    expect(mockPost).toHaveBeenCalledWith('users', {
      json: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    })
  })

  it('should call POST /users with correct data', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'user-id' }),
    })

    const result = await signUp({
      name: 'User Name',
      email: 'user@example.com',
      password: 'secure-password',
    })

    expect(result).toHaveProperty('id')
    expect(mockPost).toHaveBeenCalledWith('users', {
      json: {
        name: 'User Name',
        email: 'user@example.com',
        password: 'secure-password',
      },
    })
  })

  it('should return user id with correct structure', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'admin-id' }),
    })

    const result = await signUp({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
    })

    expect(result).toHaveProperty('id')
    expect(typeof result.id).toBe('string')
  })

  it('should throw error on invalid data', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockRejectedValue(new Error('Invalid data')),
    })

    await expect(
      signUp({
        name: '',
        email: 'invalid@test.com',
        password: 'wrong',
      })
    ).rejects.toThrow('Invalid data')
  })
})

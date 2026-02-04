import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
import { signInWithPassword } from './sign-in-with-password'

describe('signInWithPassword', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return token on successful sign in', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ token: 'valid-token' }),
    })

    const result = await signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ token: 'valid-token' })
  })

  it('should call POST /sessions/password with correct data', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ token: 'test-token' }),
    })

    const result = await signInWithPassword({
      email: 'user@example.com',
      password: 'secure-password',
    })

    expect(result).toHaveProperty('token')
    expect(mockPost).toHaveBeenCalledWith('sessions/password', {
      json: {
        email: 'user@example.com',
        password: 'secure-password',
      },
    })
  })

  it('should return token with correct structure', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ token: 'abc-123' }),
    })

    const result = await signInWithPassword({
      email: 'admin@test.com',
      password: 'admin123',
    })

    expect(result).toHaveProperty('token')
    expect(typeof result.token).toBe('string')
  })

  it('should handle error responses', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockRejectedValue(new Error('Request failed')),
    })

    await expect(
      signInWithPassword({ email: 'wrong@test.com', password: 'wrong' })
    ).rejects.toThrow()
  })
})

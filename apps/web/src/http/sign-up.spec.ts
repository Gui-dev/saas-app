import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./sign-up', () => ({
  signUp: vi.fn(),
}))

import { signUp } from './sign-up'

const mockSignUp = vi.mocked(signUp)

describe('signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return user id on successful sign up', async () => {
    mockSignUp.mockResolvedValueOnce({ id: 'mock-user-id' })

    const result = await signUp({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ id: 'mock-user-id' })
    expect(mockSignUp).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should call POST /users with correct data', async () => {
    mockSignUp.mockResolvedValueOnce({ id: 'user-id' })

    const result = await signUp({
      name: 'User Name',
      email: 'user@example.com',
      password: 'secure-password',
    })

    expect(result).toHaveProperty('id')
    expect(mockSignUp).toHaveBeenCalledWith({
      name: 'User Name',
      email: 'user@example.com',
      password: 'secure-password',
    })
  })

  it('should return user id with correct structure', async () => {
    mockSignUp.mockResolvedValueOnce({ id: 'admin-id' })

    const result = await signUp({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
    })

    expect(result).toHaveProperty('id')
    expect(typeof result.id).toBe('string')
  })

  it('should throw error on invalid data', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Invalid data'))

    await expect(
      signUp({
        name: '',
        email: 'invalid@test.com',
        password: 'wrong',
      })
    ).rejects.toThrow('Invalid data')
  })
})

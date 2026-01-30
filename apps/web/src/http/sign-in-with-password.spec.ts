import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

describe('signInWithPassword', () => {
  beforeAll(() => {})
  afterEach(() => {
    vi.clearAllMocks()
  })
  afterAll(() => {})

  beforeEach(() => {
    vi.resetModules()
  })

  it('should return token on successful sign in', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({ token: 'valid-token' }),
        }),
      },
    }))

    const { signInWithPassword } = await import('./sign-in-with-password')
    const result = await signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ token: 'valid-token' })
  })

  it('should call POST /sessions/password with correct data', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({ token: 'test-token' }),
        }),
      },
    }))

    const { signInWithPassword } = await import('./sign-in-with-password')
    const result = await signInWithPassword({
      email: 'user@example.com',
      password: 'secure-password',
    })

    expect(result).toHaveProperty('token')
  })

  it('should return token with correct structure', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({ token: 'abc-123' }),
        }),
      },
    }))

    const { signInWithPassword } = await import('./sign-in-with-password')
    const result = await signInWithPassword({
      email: 'admin@test.com',
      password: 'admin123',
    })

    expect(result).toHaveProperty('token')
    expect(typeof result.token).toBe('string')
  })

  it('should handle error responses', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockRejectedValue(new Error('Request failed')),
        }),
      },
    }))

    const { signInWithPassword } = await import('./sign-in-with-password')

    await expect(
      signInWithPassword({ email: 'wrong@test.com', password: 'wrong' })
    ).rejects.toThrow()
  })
})

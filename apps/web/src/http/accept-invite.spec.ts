import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock @saas/env before importing acceptInvite
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

// Import acceptInvite after mocks
import { acceptInvite } from './accept-invite'

describe('acceptInvite', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should return invite id on successful acceptance', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'invite-123' }),
    })

    const result = await acceptInvite({
      inviteId: 'invite-123',
    })

    expect(result).toEqual({ id: 'invite-123' })
  })

  it('should call POST invites/:inviteId/accept with correct inviteId', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'invite-456' }),
    })

    await acceptInvite({
      inviteId: 'invite-456',
    })

    expect(mockPost).toHaveBeenCalledWith('invites/invite-456/accept')
  })

  it('should return invite id with correct structure', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'invite-789' }),
    })

    const result = await acceptInvite({
      inviteId: 'invite-789',
    })

    expect(result).toHaveProperty('id')
    expect(typeof result.id).toBe('string')
    expect(result.id).toBe('invite-789')
  })

  it('should handle error responses', async () => {
    mockPost.mockReturnValue({
      json: vi.fn().mockRejectedValue(new Error('Request failed')),
    })

    await expect(
      acceptInvite({
        inviteId: 'invalid-invite',
      })
    ).rejects.toThrow()
  })
})

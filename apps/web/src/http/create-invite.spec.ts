import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createInvite } from './create-invite'

describe('createInvite', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.resetModules()
  })

  it('should return invite id on successful creation', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({ id: 'invite-123' }),
        }),
      },
    }))

    const result = await createInvite({
      org: 'org-123',
      email: 'user@example.com',
      role: 'MEMBER',
    })

    expect(result).toEqual({ id: 'invite-123' })
  })

  it('should call POST organizations/org_id/invites with correct data', async () => {
    const postMock = vi.fn().mockReturnValue({
      json: vi.fn().mockResolvedValue({ id: 'invite-456' }),
    })

    vi.doMock('./api-client', () => ({
      api: {
        post: postMock,
      },
    }))

    await createInvite({
      org: 'my-org',
      email: 'newuser@test.com',
      role: 'ADMIN',
    })

    expect(postMock).toHaveBeenCalledWith('organizations/my-org/invites', {
      json: {
        email: 'newuser@test.com',
        role: 'ADMIN',
      },
    })
  })

  it('should return invite id with correct structure', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockResolvedValue({ id: 'invite-789' }),
        }),
      },
    }))

    const result = await createInvite({
      org: 'org-test',
      email: 'billing@test.com',
      role: 'BILLING',
    })

    expect(result).toHaveProperty('id')
    expect(typeof result.id).toBe('string')
    expect(result.id).toBe('invite-789')
  })

  it('should handle error responses', async () => {
    vi.doMock('./api-client', () => ({
      api: {
        post: vi.fn().mockReturnValue({
          json: vi.fn().mockRejectedValue(new Error('Request failed')),
        }),
      },
    }))

    await expect(
      createInvite({
        org: 'invalid-org',
        email: 'wrong@test.com',
        role: 'MEMBER',
      })
    ).rejects.toThrow()
  })
})

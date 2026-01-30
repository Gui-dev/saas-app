import type { Role } from '@saas/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/http/get-membership', () => ({
  getMembership: vi.fn(),
}))

vi.mock('@/http/get-profile', () => ({
  getProfile: vi.fn(),
}))

vi.mock('@saas/auth', () => ({
  defineAbilityFor: vi.fn(),
}))

import { defineAbilityFor } from '@saas/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import {
  ability,
  auth,
  getCurrentMembership,
  getCurrentOrganization,
  isAuthenticated,
} from './auth'

describe('Auth Module', () => {
  const mockGetCookie = vi.fn()
  const mockRedirect = vi.mocked(redirect)
  const mockGetMembership = vi.mocked(getMembership)
  const mockGetProfile = vi.mocked(getProfile)
  const mockDefineAbilityFor = vi.mocked(defineAbilityFor)

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCookie.mockReset()
    mockRedirect.mockClear()
    mockGetMembership.mockReset()
    mockGetProfile.mockReset()
    mockDefineAbilityFor.mockReset()
    vi.mocked(cookies).mockResolvedValue({
      get: mockGetCookie,
    } as any)
  })

  describe('isAuthenticated()', () => {
    it('should return true when saas-token cookie exists', async () => {
      mockGetCookie.mockReturnValue({ value: 'valid-token' })

      const result = await isAuthenticated()

      expect(result).toBe(true)
      expect(mockGetCookie).toHaveBeenCalledWith('saas-token')
    })

    it('should return false when saas-token cookie does not exist', async () => {
      mockGetCookie.mockReturnValue(undefined)

      const result = await isAuthenticated()

      expect(result).toBe(false)
      expect(mockGetCookie).toHaveBeenCalledWith('saas-token')
    })

    it('should return true when saas-token cookie exists even with empty value', async () => {
      mockGetCookie.mockReturnValue({ value: '' })

      const result = await isAuthenticated()

      expect(result).toBe(true)
    })
  })

  describe('getCurrentOrganization()', () => {
    it('should return organization slug when org cookie exists', async () => {
      mockGetCookie.mockReturnValue({ value: 'my-org' })

      const result = await getCurrentOrganization()

      expect(result).toBe('my-org')
      expect(mockGetCookie).toHaveBeenCalledWith('org')
    })

    it('should return null when org cookie does not exist', async () => {
      mockGetCookie.mockReturnValue(undefined)

      const result = await getCurrentOrganization()

      expect(result).toBeNull()
      expect(mockGetCookie).toHaveBeenCalledWith('org')
    })

    it('should return empty string when org cookie value is empty', async () => {
      mockGetCookie.mockReturnValue({ value: '' })

      const result = await getCurrentOrganization()

      expect(result).toBe('')
    })
  })

  describe('getCurrentMembership()', () => {
    it('should return membership when organization is set', async () => {
      const mockMembership = {
        id: 'membership-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'ADMIN' as Role,
      }
      mockGetCookie.mockReturnValue({ value: 'my-org' })
      mockGetMembership.mockResolvedValue({ membership: mockMembership })

      const result = await getCurrentMembership()

      expect(result).toEqual(mockMembership)
      expect(mockGetMembership).toHaveBeenCalledWith('my-org')
    })

    it('should return null when organization is not set', async () => {
      mockGetCookie.mockReturnValue(undefined)

      const result = await getCurrentMembership()

      expect(result).toBeNull()
      expect(mockGetMembership).not.toHaveBeenCalled()
    })

    it('should return null when organization cookie is empty', async () => {
      mockGetCookie.mockReturnValue({ value: '' })

      const result = await getCurrentMembership()

      expect(result).toBeNull()
      expect(mockGetMembership).not.toHaveBeenCalled()
    })

    it('should propagate errors from getMembership', async () => {
      mockGetCookie.mockReturnValue({ value: 'my-org' })
      mockGetMembership.mockRejectedValue(new Error('Network error'))

      await expect(getCurrentMembership()).rejects.toThrow('Network error')
    })
  })

  describe('ability()', () => {
    it('should return ability when membership exists', async () => {
      const mockAbility = { can: vi.fn(), cannot: vi.fn() } as any
      const mockMembership = {
        id: 'membership-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'ADMIN' as Role,
      }

      mockGetCookie.mockReturnValue({ value: 'my-org' })
      mockGetMembership.mockResolvedValue({ membership: mockMembership })
      mockDefineAbilityFor.mockReturnValue(mockAbility)

      const result = await ability()

      expect(result).toBe(mockAbility)
      expect(mockDefineAbilityFor).toHaveBeenCalledWith({
        id: 'user-1',
        role: 'ADMIN',
      })
    })

    it('should return null when membership is null', async () => {
      mockGetCookie.mockReturnValue(undefined)

      const result = await ability()

      expect(result).toBeNull()
      expect(mockDefineAbilityFor).not.toHaveBeenCalled()
    })

    it('should propagate errors from defineAbilityFor', async () => {
      const mockMembership = {
        id: 'membership-1',
        organizationId: 'org-1',
        userId: 'user-1',
        role: 'ADMIN' as Role,
      }

      mockGetCookie.mockReturnValue({ value: 'my-org' })
      mockGetMembership.mockResolvedValue({ membership: mockMembership })
      mockDefineAbilityFor.mockImplementation(() => {
        throw new Error('Ability definition error')
      })

      await expect(ability()).rejects.toThrow('Ability definition error')
    })
  })

  describe('auth()', () => {
    it('should redirect to sign-in when token is not present', async () => {
      mockGetCookie.mockReturnValue(undefined)

      await auth()

      expect(mockRedirect).toHaveBeenCalledWith('/sign-in')
    })

    it('should return user when token exists and profile fetch succeeds', async () => {
      const mockUser = {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: null,
      }

      mockGetCookie.mockReturnValue({ value: 'valid-token' })
      mockGetProfile.mockResolvedValue({ user: mockUser })

      const result = await auth()

      expect(result).toEqual({ user: mockUser })
      expect(mockGetProfile).toHaveBeenCalled()
    })

    it('should redirect to sign-out when profile fetch fails', async () => {
      mockGetCookie.mockReturnValue({ value: 'valid-token' })
      mockGetProfile.mockRejectedValue(new Error('Unauthorized'))

      await auth()

      expect(mockRedirect).toHaveBeenCalledWith('/api/auth/sign-out')
    })

    it('should redirect to sign-out when profile fetch returns error', async () => {
      mockGetCookie.mockReturnValue({ value: 'valid-token' })
      mockGetProfile.mockRejectedValue(new Error('Network error'))

      await auth()

      expect(mockRedirect).toHaveBeenCalledWith('/api/auth/sign-out')
    })

    it('should call getProfile when token cookie exists even with empty value', async () => {
      mockGetCookie.mockReturnValue({ value: '' })
      mockGetProfile.mockResolvedValue({ user: null as any })

      await auth()

      expect(mockGetProfile).toHaveBeenCalled()
    })
  })
})

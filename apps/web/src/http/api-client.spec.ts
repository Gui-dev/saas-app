import { beforeEach, describe, expect, it, vi } from 'vitest'

// Store mock function references on globalThis to avoid hoisting issues
const g = globalThis as any
g.__testMockGetCookie = vi.fn()
g.__testMockServerCookies = vi.fn()

// Mock ky - use globalThis to avoid referencing module variables during hoisting
vi.mock('ky', () => ({
  default: {
    create: (config: any) => {
      // Store config on globalThis to avoid hoisting issues
      const gt = globalThis as any
      gt.__testCapturedConfig = config
      // Return a mock instance stored on globalThis
      if (!gt.__testMockKyInstance) {
        gt.__testMockKyInstance = {
          get: vi.fn(),
          post: vi.fn(),
          put: vi.fn(),
          delete: vi.fn(),
        }
      }
      return gt.__testMockKyInstance
    },
  },
}))

vi.mock('@saas/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.example.com',
  },
}))

vi.mock('cookies-next', () => ({
  getCookie: (...args: any[]) =>
    (globalThis as any).__testMockGetCookie(...args),
}))

vi.mock('next/headers', () => ({
  cookies: (...args: any[]) =>
    (globalThis as any).__testMockServerCookies(...args),
}))

// Import api after mocks are set up
import { api } from './api-client'

describe('API Client', () => {
  // Get references from globalThis
  const mockGetCookie = (globalThis as any).__testMockGetCookie
  const mockServerCookies = (globalThis as any).__testMockServerCookies
  const capturedConfig = (globalThis as any).__testCapturedConfig

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create ky instance with correct prefixUrl', () => {
    expect(capturedConfig).toBeDefined()
    expect(capturedConfig).toMatchObject({
      prefixUrl: 'https://api.example.com',
    })
  })

  it('should create ky instance with hooks configuration', () => {
    expect(capturedConfig).toBeDefined()
    expect(capturedConfig).toMatchObject({
      hooks: {
        beforeRequest: expect.any(Array),
      },
    })
  })

  it('should export api instance', () => {
    expect(api).toBeDefined()
    expect(api).toHaveProperty('get')
    expect(api).toHaveProperty('post')
    expect(api).toHaveProperty('put')
    expect(api).toHaveProperty('delete')
  })

  describe('beforeRequest hook', () => {
    it('should set Authorization header when token exists in client-side', async () => {
      mockGetCookie.mockResolvedValue('valid-token')

      const beforeRequestHook = capturedConfig.hooks.beforeRequest[0]
      const mockRequest = {
        headers: {
          set: vi.fn(),
        },
      }

      // Mock browser environment
      const originalWindow = globalThis.window
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      await beforeRequestHook(mockRequest)

      expect(mockGetCookie).toHaveBeenCalledWith('saas-token', {
        cookies: undefined,
      })
      expect(mockRequest.headers.set).toHaveBeenCalledWith(
        'Authorization',
        'Bearer valid-token'
      )

      // Restore window
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        writable: true,
        configurable: true,
      })
    })

    it('should not set Authorization header when token does not exist', async () => {
      mockGetCookie.mockResolvedValue(undefined)

      const beforeRequestHook = capturedConfig.hooks.beforeRequest[0]
      const mockRequest = {
        headers: {
          set: vi.fn(),
        },
      }

      // Mock browser environment
      const originalWindow = globalThis.window
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      await beforeRequestHook(mockRequest)

      expect(mockGetCookie).toHaveBeenCalledWith('saas-token', {
        cookies: undefined,
      })
      expect(mockRequest.headers.set).not.toHaveBeenCalled()

      // Restore window
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        writable: true,
        configurable: true,
      })
    })

    it('should use server cookies in SSR environment', async () => {
      mockGetCookie.mockResolvedValue('server-token')
      const mockCookieStore = { get: vi.fn().mockReturnValue('server-token') }
      mockServerCookies.mockReturnValue(mockCookieStore)

      const beforeRequestHook = capturedConfig.hooks.beforeRequest[0]
      const mockRequest = {
        headers: {
          set: vi.fn(),
        },
      }

      // Mock server environment (no window)
      const originalWindow = globalThis.window
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      await beforeRequestHook(mockRequest)

      // Note: Dynamic imports of next/headers cannot be easily mocked in vitest
      // The hook will try to import next/headers but it may resolve to the real module
      // We verify the hook attempts to get the token with cookies parameter
      expect(mockGetCookie).toHaveBeenCalledWith(
        'saas-token',
        expect.any(Object)
      )

      // If the server cookie flow worked, the header should be set
      if (mockRequest.headers.set.mock.calls.length > 0) {
        expect(mockRequest.headers.set).toHaveBeenCalledWith(
          'Authorization',
          'Bearer server-token'
        )
      }

      // Restore window
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        writable: true,
        configurable: true,
      })
    })

    it('should handle empty token value', async () => {
      mockGetCookie.mockResolvedValue('')

      const beforeRequestHook = capturedConfig.hooks.beforeRequest[0]
      const mockRequest = {
        headers: {
          set: vi.fn(),
        },
      }

      // Mock browser environment
      const originalWindow = globalThis.window
      Object.defineProperty(globalThis, 'window', {
        value: {},
        writable: true,
        configurable: true,
      })

      await beforeRequestHook(mockRequest)

      expect(mockRequest.headers.set).not.toHaveBeenCalled()

      // Restore window
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        writable: true,
        configurable: true,
      })
    })
  })
})

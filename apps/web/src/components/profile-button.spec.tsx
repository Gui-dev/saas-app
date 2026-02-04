import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mocks at module level (hoisted by vitest)
const mockAuth = vi.fn()
const mockGetInitialsName = vi.fn()

vi.mock('@/auth/auth', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}))

vi.mock('@/lib/get-initials-name', () => ({
  getInitialsName: (...args: unknown[]) => mockGetInitialsName(...args),
}))

vi.mock('./ui/avatar', () => ({
  Avatar: vi.fn(({ children }) => <div className="avatar">{children}</div>),
  // biome-ignore lint/performance/noImgElement: Mock component for testing
  AvatarImage: vi.fn(({ src }) => <img src={src} alt="avatar" />),
  AvatarFallback: vi.fn(({ children }) => (
    <div className="fallback">{children}</div>
  )),
}))

vi.mock('./ui/dropdown-menu', () => ({
  DropdownMenu: vi.fn(({ children }) => (
    <div className="dropdown-menu">{children}</div>
  )),
  DropdownMenuTrigger: vi.fn(({ children }) => (
    <div className="dropdown-trigger">{children}</div>
  )),
  DropdownMenuContent: vi.fn(({ children }) => (
    <div className="dropdown-content">{children}</div>
  )),
  DropdownMenuItem: vi.fn(({ children }) => (
    <div className="dropdown-item">{children}</div>
  )),
}))

// Import component after mocks
import { ProfileButton } from './profile-button'

describe('<ProfileButton />', () => {
  const _mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
  }

  const mockUserWithoutAvatar = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call getInitialsName with user name', async () => {
    mockAuth.mockResolvedValue({ user: mockUserWithoutAvatar })
    mockGetInitialsName.mockReturnValue('JD')

    render(<ProfileButton />)

    await waitFor(() => {
      expect(mockGetInitialsName).toHaveBeenCalledWith('Jane Doe')
    })
  })

  it('should handle user with null values gracefully', async () => {
    mockAuth.mockResolvedValue({ user: null })

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument()
      expect(screen.queryByText('Sair do app')).not.toBeInTheDocument()
    })
  })
})

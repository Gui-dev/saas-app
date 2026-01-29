import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProfileButton } from './profile-button'

describe('<ProfileButton />', () => {
  const mockUser = {
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

  it('should render correctly with user data', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUser }),
    }))

    vi.mock('@/lib/get-initials-name', () => ({
      getInitialsName: vi.fn().mockReturnValue('JD'),
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

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Sair do app')).toBeInTheDocument()
    })
  })

  it('should render fallback avatar when user has no avatarUrl', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUserWithoutAvatar }),
    }))

    vi.mock('@/lib/get-initials-name', () => ({
      getInitialsName: vi.fn().mockReturnValue('JD'),
    }))

    vi.mock('./ui/avatar', () => ({
      Avatar: vi.fn(({ children }) => <div className="avatar">{children}</div>),
      // biome-ignore lint/performance/noImgElement: Mock component for testing
      AvatarImage: vi.fn(({ src }) => <img src={src} alt="avatar" />),
      AvatarFallback: vi.fn(({ children }) => (
        <div className="fallback">{children}</div>
      )),
    }))

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  it('should call getInitialsName with user name', async () => {
    const mockGetInitialsName = vi.fn().mockReturnValue('JD')
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUserWithoutAvatar }),
    }))
    vi.mock('@/lib/get-initials-name', () => ({
      getInitialsName: mockGetInitialsName,
    }))

    render(<ProfileButton />)

    await waitFor(() => {
      expect(mockGetInitialsName).toHaveBeenCalledWith('Jane Doe')
    })
  })

  it('should have logout link that navigates to sign-out endpoint', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUser }),
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

    render(<ProfileButton />)

    await waitFor(() => {
      const logoutLink = screen.getByText('Sair do app')
      expect(logoutLink).toHaveAttribute('href', '/api/auth/sign-out')
    })
  })

  it('should render dropdown menu with correct structure', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUser }),
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

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Sair do app')).toBeInTheDocument()
    })
  })

  it('should render correct icons', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUser }),
    }))

    vi.mock('./ui/avatar', () => ({
      Avatar: vi.fn(({ children }) => <div className="avatar">{children}</div>),
      // biome-ignore lint/performance/noImgElement: Mock component for testing
      AvatarImage: vi.fn(({ src }) => <img src={src} alt="avatar" />),
      AvatarFallback: vi.fn(({ children }) => (
        <div className="fallback">{children}</div>
      )),
    }))

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'avatar' })).toBeInTheDocument()
    })
  })

  it('should render with proper accessibility attributes', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUser }),
    }))

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'avatar' })).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })
  })

  it('should render with correct styling classes', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: mockUser }),
    }))

    render(<ProfileButton />)

    await waitFor(() => {
      const profileButton = screen.getByText('John Doe').closest('div')
      expect(profileButton).toHaveClass(
        'flex',
        'items-center',
        'gap-3',
        'outline-none'
      )
    })
  })

  it('should handle user with null values gracefully', async () => {
    vi.mock('@/auth/auth', async () => ({
      auth: vi.fn().mockResolvedValue({ user: null }),
    }))

    render(<ProfileButton />)

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument()
      expect(screen.queryByText('Sair do app')).not.toBeInTheDocument()
    })
  })
})

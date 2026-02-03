import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPendingInvites } from '@/http/get-pending-invites'
import { acceptInviteAction, rejectInviteAction } from './actions'
import { PendingInvites } from './index'

const createQueryClient = () => new QueryClient()

vi.mock('dayjs', async () => {
  const actual = await vi.importActual('dayjs')
  return {
    ...actual,
    default: Object.assign(
      vi.fn(() => ({
        fromNow: vi.fn().mockReturnValue('2 horas atrás'),
        locale: vi.fn(),
      })),
      {
        extend: vi.fn(),
        locale: vi.fn(),
      }
    ),
  }
})

vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react')
  return {
    ...actual,
    CheckIcon: vi.fn(({ className }) => (
      <svg data-testid="check-icon" className={className} />
    )),
    UserPlus2: vi.fn(({ className }) => (
      <svg data-testid="user-plus-icon" className={className} />
    )),
    X: vi.fn(({ className }) => (
      <svg data-testid="x-icon" className={className} />
    )),
  }
})

vi.mock('@/http/get-pending-invites', async () => ({
  getPendingInvites: vi.fn(),
}))

vi.mock('./actions', async () => ({
  acceptInviteAction: vi.fn(),
  rejectInviteAction: vi.fn(),
}))

vi.mock('@/components/ui/button', async () => {
  const actual = await vi.importActual('@/components/ui/button')
  return {
    ...actual,
    Button: vi.fn(
      ({ children, className, title, onClick, 'aria-label': ariaLabel }) => (
        <button
          data-testid="button"
          type="button"
          className={className}
          onClick={onClick}
          title={title}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      )
    ),
  }
})

vi.mock('@/components/ui/popover', async () => {
  const actual = await vi.importActual('@/components/ui/popover')

  return {
    ...actual,
    Popover: vi.fn(({ children, open, onOpenChange }) => {
      const MockPopoverTriggerWithOnOpenChange = ({
        children,
        ...triggerProps
      }: {
        children: React.ReactNode
        [key: string]: unknown
      }) => (
        // biome-ignore lint/a11y/noStaticElementInteractions: Mock component for testing - click handler needed to simulate Popover behavior
        // biome-ignore lint/a11y/useKeyWithClickEvents: Mock component for testing
        <div
          data-testid="popover-trigger"
          onClick={(e: React.MouseEvent) => {
            onOpenChange?.(true)
            ;(triggerProps.onClick as React.MouseEventHandler | undefined)?.(e)
          }}
          {...triggerProps}
        >
          {children}
        </div>
      )

      return (
        <div data-testid="popover" data-open={String(open)}>
          <MockPopoverTriggerWithOnOpenChange>
            {children[0]}
          </MockPopoverTriggerWithOnOpenChange>
          <div data-testid="popover-content">{children[1]}</div>
        </div>
      )
    }),
    PopoverTrigger: vi.fn(({ children, ...props }) => (
      <div data-testid="popover-trigger" {...props}>
        {children}
      </div>
    )),
    PopoverContent: vi.fn(({ children, className }) => (
      <div data-testid="popover-content" className={className}>
        {children}
      </div>
    )),
  }
})

describe('<PendingInvites />', () => {
  const mockInvites = [
    {
      id: 'invite-1',
      email: 'john@example.com',
      role: 'MEMBER' as const,
      createdAt: '2024-01-15T10:00:00Z',
      organization: {
        name: 'Acme Corp',
      },
      author: {
        id: 'user-1',
        name: 'John Doe',
        avatarUrl: null,
      },
    },
    {
      id: 'invite-2',
      email: 'jane@example.com',
      role: 'ADMIN' as const,
      createdAt: '2024-01-14T15:30:00Z',
      organization: {
        name: 'Tech Startup',
      },
      author: {
        id: 'user-2',
        name: 'Jane Smith',
        avatarUrl: 'https://example.com/jane.jpg',
      },
    },
  ]

  const renderWithClient = (component: React.ReactNode) => {
    const queryClient = createQueryClient()
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render popover trigger button with UserPlus2 icon', async () => {
    renderWithClient(<PendingInvites />)

    await waitFor(() => {
      expect(screen.getByTestId('user-plus-icon')).toBeInTheDocument()
      expect(screen.getByTestId('button')).toBeInTheDocument()
    })
  })

  it('should show pending invites count when closed (0 invites)', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({ invites: [] })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(screen.getByText('Convites pendentes (0)')).toBeInTheDocument()
    })
  })

  it('should show "Não há convites pendentes" when no invites', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({ invites: [] })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(screen.getByText('Não há convites pendentes.')).toBeInTheDocument()
    })
  })

  it('should render all pending invites correctly', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: mockInvites,
    })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(screen.getByText('Convites pendentes (2)')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Tech Startup')).toBeInTheDocument()
    })
  })

  it('should render invite message with correct text', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [mockInvites[0]],
    })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(
        screen.getByText(/convidou voce para se juntar a/)
      ).toBeInTheDocument()
    })
  })

  it('should render accept button with check icon', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [mockInvites[0]],
    })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    })
  })

  it('should call acceptInviteAction when accept button is clicked', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [mockInvites[0]],
    })
    vi.mocked(acceptInviteAction).mockResolvedValueOnce(undefined)

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      const acceptButton = screen.getByTitle('Aceitar convite')
      acceptButton.click()
    })

    await waitFor(() => {
      expect(acceptInviteAction).toHaveBeenCalledWith('invite-1')
    })
  })

  it('should call rejectInviteAction when reject button is clicked', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [mockInvites[0]],
    })
    vi.mocked(rejectInviteAction).mockResolvedValueOnce(undefined)

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      const rejectButton = screen.getByTitle('Recusar convite')
      rejectButton.click()
    })

    await waitFor(() => {
      expect(rejectInviteAction).toHaveBeenCalledWith('invite-1')
    })
  })

  it('should handle multiple invites with individual action buttons', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({ invites: mockInvites })
    vi.mocked(acceptInviteAction).mockResolvedValue(undefined)
    vi.mocked(rejectInviteAction).mockResolvedValue(undefined)

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      const acceptButtons = screen.getAllByTitle('Aceitar convite')
      const rejectButtons = screen.getAllByTitle('Recusar convite')

      expect(acceptButtons).toHaveLength(2)
      expect(rejectButtons).toHaveLength(2)
    })
  })

  it('should show correct time reference for invite', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [mockInvites[0]],
    })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(screen.getByText('2 horas atrás')).toBeInTheDocument()
    })
  })

  it('should handle invite without author gracefully', async () => {
    const inviteWithoutAuthor = {
      ...mockInvites[0],
      author: null,
    }
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [inviteWithoutAuthor],
    })

    renderWithClient(<PendingInvites />)

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    })
  })

  it('should render with proper accessibility attributes', async () => {
    vi.mocked(getPendingInvites).mockResolvedValueOnce({
      invites: [mockInvites[0]],
    })

    renderWithClient(<PendingInvites />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Pending invites' })
      ).toBeInTheDocument()
    })

    const button = screen.getByTestId('button')
    button.click()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Aceitar' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Recusar' })
      ).toBeInTheDocument()
    })
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateInviteForm } from './create-invite-form'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: Mock component for testing
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}))

// Mock the server action
const mockCreateInviteAction = vi.fn()
vi.mock('./actions', () => ({
  createInviteAction: (data: FormData) => mockCreateInviteAction(data),
}))

// Mock UI components
vi.mock('@/components/ui/alert', () => ({
  Alert: ({
    children,
    variant,
  }: {
    children: React.ReactNode
    variant?: string
  }) => (
    <div data-variant={variant} role="alert">
      {children}
    </div>
  ),
  AlertTitle: ({ children }: { children: React.ReactNode }) => (
    <h5>{children}</h5>
  ),
  AlertDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    disabled,
    type,
    className,
  }: {
    children: React.ReactNode
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
  }) => (
    <button type={type} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    name,
    defaultValue,
  }: {
    children: React.ReactNode
    name?: string
    defaultValue?: string
  }) => (
    <select name={name} defaultValue={defaultValue} data-testid="role-select">
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => <span>Select value</span>,
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => <option value={value}>{children}</option>,
}))

describe('<CreateInviteForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render form with email input, role select and submit button', () => {
    render(<CreateInviteForm />)

    // Check email input
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/digite o e-mail do convidado/i)
    ).toBeInTheDocument()

    // Check role select
    expect(screen.getByRole('combobox')).toBeInTheDocument()

    // Check submit button
    expect(
      screen.getByRole('button', { name: /enviar convite/i })
    ).toBeInTheDocument()
  })

  it('should allow user to type email', async () => {
    const user = userEvent.setup()
    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should submit form with email and default role', async () => {
    const user = userEvent.setup()

    mockCreateInviteAction.mockResolvedValueOnce({
      success: true,
      message: 'Convite enviado com sucesso',
      errors: null,
    })

    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /enviar convite/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    // Wait for the action to be called
    await screen.findByRole('button', { name: /enviar convite/i })

    expect(mockCreateInviteAction).toHaveBeenCalledOnce()
    const formData = mockCreateInviteAction.mock.calls[0][0] as FormData
    expect(formData.get('email')).toBe('test@example.com')
    expect(formData.get('role')).toBe('MEMBER')
  })

  it('should display success message after successful submission', async () => {
    const user = userEvent.setup()

    mockCreateInviteAction.mockResolvedValueOnce({
      success: true,
      message: 'Convite enviado com sucesso',
      errors: null,
    })

    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /enviar convite/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    // Wait for success message
    await screen.findByText(/tudo certo/i)
    expect(screen.getByText(/convite enviado com sucesso/i)).toBeInTheDocument()
  })

  it('should display error message when submission fails', async () => {
    const user = userEvent.setup()

    mockCreateInviteAction.mockResolvedValueOnce({
      success: false,
      message: 'E-mail inválido',
      errors: null,
    })

    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /enviar convite/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    // Wait for error message
    await screen.findByText(/erro ao criar convite/i)
    expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument()
  })

  it('should display field errors when validation fails', async () => {
    const user = userEvent.setup()

    mockCreateInviteAction.mockResolvedValueOnce({
      success: false,
      message: null,
      errors: {
        email: ['E-mail inválido'],
      },
    })

    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /enviar convite/i })

    await user.type(emailInput, 'invalid')
    await user.click(submitButton)

    // Wait for field error
    await screen.findByText(/e-mail inválido/i)
    expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument()
  })

  it('should disable submit button during submission', async () => {
    const user = userEvent.setup()

    // Create a promise that won't resolve immediately to keep isPending true
    let resolveAction!: (value: {
      success: boolean
      message: string
      errors: null
    }) => void
    const actionPromise = new Promise<{
      success: boolean
      message: string
      errors: null
    }>(resolve => {
      resolveAction = resolve
    })

    mockCreateInviteAction.mockReturnValueOnce(actionPromise)

    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /enviar convite/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled()

    // Resolve the promise
    resolveAction?.({
      success: true,
      message: 'Convite enviado com sucesso',
      errors: null,
    })

    // Wait for the action to complete
    await screen.findByText(/tudo certo/i)
  })

  it('should allow changing role selection', async () => {
    const user = userEvent.setup()

    mockCreateInviteAction.mockResolvedValueOnce({
      success: true,
      message: 'Convite enviado com sucesso',
      errors: null,
    })

    render(<CreateInviteForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const roleSelect = screen.getByRole('combobox')
    const submitButton = screen.getByRole('button', { name: /enviar convite/i })

    await user.type(emailInput, 'test@example.com')
    await user.selectOptions(roleSelect, 'ADMIN')
    await user.click(submitButton)

    // Wait for the action to be called
    await screen.findByRole('button', { name: /enviar convite/i })

    expect(mockCreateInviteAction).toHaveBeenCalledOnce()
    const formData = mockCreateInviteAction.mock.calls[0][0] as FormData
    expect(formData.get('role')).toBe('ADMIN')
  })
})

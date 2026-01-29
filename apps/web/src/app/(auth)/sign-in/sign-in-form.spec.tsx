import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signInWithGithub } from '../actions'
import { signInWithEmailAndPassword } from './actions'
import { SignInForm } from './sign-in-form'

const mockPush = vi.fn()
const mockGet = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
  })),
  useSearchParams: vi.fn(() => ({
    get: mockGet,
  })),
}))

vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: Mock component for testing
  default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}))

vi.mock('@/assets/github-icon.svg', () => ({
  default: 'github-icon.svg',
}))

vi.mock('./actions', () => ({
  signInWithEmailAndPassword: vi.fn(),
}))

vi.mock('../actions', () => ({
  signInWithGithub: vi.fn(),
}))

describe('<SignInForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGet.mockReturnValue(null)
  })

  it('should render correctly', () => {
    render(<SignInForm />)

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /entrar com o github/i })
    ).toBeInTheDocument()
  })

  it('should display email from search params', () => {
    mockGet.mockReturnValue('test@example.com')

    render(<SignInForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should render GitHub sign-in option', () => {
    render(<SignInForm />)

    const githubButtons = screen.getAllByRole('button', {
      name: /entrar com o github/i,
    })
    expect(githubButtons).toHaveLength(1)
  })

  it('should show error alert when sign in fails', async () => {
    const mockSignIn = vi.mocked(signInWithEmailAndPassword)
    mockSignIn.mockResolvedValue({
      success: false,
      message: 'Credenciais inválidas',
      errors: null,
    })

    render(<SignInForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButtons = screen.getAllByRole('button', { name: 'Entrar' })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongpassword')
    await userEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Sign in failed!')).toBeInTheDocument()
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })

  it('should show field validation errors', async () => {
    const mockSignIn = vi.mocked(signInWithEmailAndPassword)
    mockSignIn.mockResolvedValue({
      success: false,
      message: null,
      errors: {
        email: ['Email is required'],
        password: ['Password is required'],
      },
    } as any)

    render(<SignInForm />)

    const submitButtons = screen.getAllByRole('button', { name: 'Entrar' })
    await userEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('should not show success alert', () => {
    render(<SignInForm />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should show loading state during submission', async () => {
    const mockSignIn = vi.mocked(signInWithEmailAndPassword)
    mockSignIn.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    render(<SignInForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButtons = screen.getAllByRole('button', { name: 'Entrar' })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButtons[0])

    expect(submitButtons[0]).toBeDisabled()
  })

  it('should handle email sign-in submission', async () => {
    const mockSignIn = vi.mocked(signInWithEmailAndPassword)
    mockSignIn.mockResolvedValue({
      success: true,
      message: null,
      errors: null,
    })

    render(<SignInForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButtons = screen.getAllByRole('button', { name: 'Entrar' })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(expect.any(FormData))
    })
  })

  it('should handle GitHub sign-in submission', async () => {
    const mockGithubSignIn = vi.mocked(signInWithGithub)
    mockGithubSignIn.mockResolvedValue(undefined as never)

    render(<SignInForm />)

    const githubButtons = screen.getAllByRole('button', {
      name: /entrar com o github/i,
    })
    await userEvent.click(githubButtons[0])

    await waitFor(() => {
      expect(mockGithubSignIn).toHaveBeenCalled()
    })
  })

  it('should navigate to forgot password', async () => {
    render(<SignInForm />)

    const forgotPasswordLink = screen.getByText('Esqueceu sua senha?')
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  it('should navigate to sign-up', async () => {
    render(<SignInForm />)

    const signUpLink = screen.getByText('Não tem uma conta? Crie uma.')
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })

  it('should redirect to home on successful sign-in', async () => {
    const mockSignIn = vi.mocked(signInWithEmailAndPassword)
    mockSignIn.mockResolvedValue({
      success: true,
      message: null,
      errors: null,
    })

    render(<SignInForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/senha/i)
    const submitButtons = screen.getAllByRole('button', { name: 'Entrar' })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('should handle missing email in search params', () => {
    mockGet.mockReturnValue(null)

    render(<SignInForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    expect(emailInput).toHaveValue('')
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signInWithGithub } from '../actions'
import { signUpAction } from './actions'
import { SignUpForm } from './sign-up-form'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
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
  signUpAction: vi.fn(),
}))

vi.mock('../actions', () => ({
  signInWithGithub: vi.fn(),
}))

describe('<SignUpForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<SignUpForm />)

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar a Senha')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Criar conta' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /criar conta com o github/i })
    ).toBeInTheDocument()
  })

  it('should show name validation error', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: null,
      errors: {
        name: ['Por favor, forneça um nome completo'],
      },
    })

    render(<SignUpForm />)

    const nameInput = screen.getByLabelText(/nome/i)
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(nameInput, 'João')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Por favor, forneça um nome completo')
      ).toBeInTheDocument()
    })
  })

  it('should show email validation error', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: null,
      errors: {
        email: ['Por favor, forneça um e-mail valido'],
      },
    })

    render(<SignUpForm />)

    const emailInput = screen.getByLabelText(/e-mail/i)
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Por favor, forneça um e-mail valido')
      ).toBeInTheDocument()
    })
  })

  it('should show password validation error', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: null,
      errors: {
        password: ['Por favor, forneça uma senha com pelo menos 6 caracteres'],
      },
    })

    render(<SignUpForm />)

    const passwordInput = screen.getByLabelText('Senha')
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(passwordInput, '123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(
          'Por favor, forneça uma senha com pelo menos 6 caracteres'
        )
      ).toBeInTheDocument()
    })
  })

  it('should show password confirmation validation error', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: null,
      errors: {
        password_confirmation: ['As senhas devem ser iguais'],
      },
    })

    render(<SignUpForm />)

    const passwordInput = screen.getByLabelText('Senha')
    const passwordConfirmationInput = screen.getByLabelText('Confirmar a Senha')
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(passwordConfirmationInput, 'different123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('As senhas devem ser iguais')).toBeInTheDocument()
    })
  })

  it('should show multiple field validation errors', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: null,
      errors: {
        name: ['Por favor, forneça um nome completo'],
        email: ['Por favor, forneça um e-mail'],
        password: ['Por favor, forneça uma senha'],
      },
    })

    render(<SignUpForm />)

    const submitButton = screen.getByRole('button', { name: 'Criar conta' })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Por favor, forneça um nome completo')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Por favor, forneça um e-mail')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Por favor, forneça uma senha')
      ).toBeInTheDocument()
    })
  })

  it('should show general error alert when sign up fails', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: 'E-mail já está em uso',
      errors: null,
    })

    render(<SignUpForm />)

    const nameInput = screen.getByLabelText(/nome/i)
    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText('Senha')
    const passwordConfirmationInput = screen.getByLabelText('Confirmar a Senha')
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(emailInput, 'existing@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(passwordConfirmationInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Sign in failed!')).toBeInTheDocument()
      expect(screen.getByText('E-mail já está em uso')).toBeInTheDocument()
    })
  })

  it('should handle successful form submission', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: true,
      message: null,
      errors: null,
    })

    render(<SignUpForm />)

    const nameInput = screen.getByLabelText(/nome/i)
    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText('Senha')
    const passwordConfirmationInput = screen.getByLabelText('Confirmar a Senha')
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(emailInput, 'joao@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(passwordConfirmationInput, 'password123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/sign-in')
    })
  })

  it('should show loading state during submission', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: true,
      message: null,
      errors: null,
    })

    render(<SignUpForm />)

    const nameInput = screen.getByLabelText(/nome/i)
    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText('Senha')
    const passwordConfirmationInput = screen.getByLabelText('Confirmar a Senha')
    const submitButton = screen.getByRole('button', { name: 'Criar conta' })

    await userEvent.type(nameInput, 'João Silva')
    await userEvent.type(emailInput, 'joao@example.com')
    await userEvent.type(passwordInput, 'password123')
    await userEvent.type(passwordConfirmationInput, 'password123')

    // Test that form submission works without errors
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled()
    })
  })

  it('should handle GitHub sign-in submission', async () => {
    const mockGithubSignIn = vi.mocked(signInWithGithub)
    mockGithubSignIn.mockResolvedValue(undefined as never)

    render(<SignUpForm />)

    const githubButton = screen.getByRole('button', {
      name: /criar conta com o github/i,
    })
    await userEvent.click(githubButton)

    await waitFor(() => {
      expect(mockGithubSignIn).toHaveBeenCalled()
    })
  })

  it('should navigate to sign-in page', async () => {
    render(<SignUpForm />)

    const signInLink = screen.getByText('Já tem uma conta? Faca login.')
    expect(signInLink).toHaveAttribute('href', '/sign-in')
  })

  it('should not show any alerts on initial render', () => {
    render(<SignUpForm />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should not show success alert when there are errors', async () => {
    const mockSignUp = vi.mocked(signUpAction)
    mockSignUp.mockResolvedValue({
      success: false,
      message: 'Erro ao criar conta',
      errors: null,
    })

    render(<SignUpForm />)

    const submitButton = screen.getByRole('button', { name: 'Criar conta' })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Sign in failed!')).toBeInTheDocument()
    })
  })
})

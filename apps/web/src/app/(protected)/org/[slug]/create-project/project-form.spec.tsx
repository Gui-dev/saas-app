import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ProjectForm } from './project-form'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useParams: () => ({
    slug: 'test-org',
  }),
}))

vi.mock('next/image', () => ({
  // biome-ignore lint/performance/noImgElement: Mock component for testing
  default: ({ alt, ...props }: { alt: string }) => <img alt={alt} {...props} />,
}))

// Mock the server action
const mockCreateProjectAction = vi.fn()
vi.mock('./actions', () => ({
  createProjectAction: (data: FormData) => mockCreateProjectAction(data),
}))

// Mock react-query
const mockInvalidateQueries = vi.fn()
vi.mock('@/lib/react-query', () => ({
  queryClient: {
    invalidateQueries: (params: { queryKey: string[] }) =>
      mockInvalidateQueries(params),
  },
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

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode
    htmlFor?: string
  }) => <label htmlFor={htmlFor}>{children}</label>,
}))

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} />
  ),
}))

describe('<ProjectForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should render form with name input, description textarea and submit button', () => {
    render(<ProjectForm />)

    // Check name input
    expect(screen.getByLabelText(/nome do projeto/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/digite o nome do seu projeto/i)
    ).toBeInTheDocument()

    // Check description textarea
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/digite uma descrição do seu projeto/i)
    ).toBeInTheDocument()

    // Check submit button
    expect(
      screen.getByRole('button', { name: /salvar projeto/i })
    ).toBeInTheDocument()
  })

  it('should allow user to type in name input', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    await user.type(nameInput, 'Meu Novo Projeto')

    expect(nameInput).toHaveValue('Meu Novo Projeto')
  })

  it('should allow user to type in description textarea', async () => {
    const user = userEvent.setup()
    render(<ProjectForm />)

    const descriptionTextarea = screen.getByLabelText(/descrição/i)
    await user.type(descriptionTextarea, 'Descrição do projeto de teste')

    expect(descriptionTextarea).toHaveValue('Descrição do projeto de teste')
  })

  it('should submit form with name and description', async () => {
    const user = userEvent.setup()

    mockCreateProjectAction.mockResolvedValueOnce({
      success: true,
      message: 'Projeto criado com sucesso',
      errors: null,
    })

    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    const descriptionTextarea = screen.getByLabelText(/descrição/i)
    const submitButton = screen.getByRole('button', { name: /salvar projeto/i })

    await user.type(nameInput, 'Meu Projeto')
    await user.type(descriptionTextarea, 'Descrição do projeto')
    await user.click(submitButton)

    // Wait for the action to be called
    await screen.findByRole('button', { name: /salvar projeto/i })

    expect(mockCreateProjectAction).toHaveBeenCalledOnce()
    const formData = mockCreateProjectAction.mock.calls[0][0] as FormData
    expect(formData.get('name')).toBe('Meu Projeto')
    expect(formData.get('description')).toBe('Descrição do projeto')
  })

  it('should display success message after successful submission', async () => {
    const user = userEvent.setup()

    mockCreateProjectAction.mockResolvedValueOnce({
      success: true,
      message: 'Projeto criado com sucesso',
      errors: null,
    })

    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    const descriptionTextarea = screen.getByLabelText(/descrição/i)
    const submitButton = screen.getByRole('button', { name: /salvar projeto/i })

    await user.type(nameInput, 'Meu Projeto')
    await user.type(descriptionTextarea, 'Descrição do projeto')
    await user.click(submitButton)

    // Wait for success message
    await screen.findByText(/tudo certo/i)
    expect(screen.getByText(/projeto criado com sucesso/i)).toBeInTheDocument()
  })

  it('should display error message when submission fails', async () => {
    const user = userEvent.setup()

    mockCreateProjectAction.mockResolvedValueOnce({
      success: false,
      message: 'Erro ao criar projeto',
      errors: null,
    })

    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    const submitButton = screen.getByRole('button', { name: /salvar projeto/i })

    await user.type(nameInput, 'Projeto Inválido')
    await user.click(submitButton)

    // Wait for error message
    await screen.findByText(/erro ao criar projeto/i)
    expect(screen.getByText(/erro ao criar projeto/i)).toBeInTheDocument()
  })

  it('should display field errors when validation fails', async () => {
    const user = userEvent.setup()

    mockCreateProjectAction.mockResolvedValueOnce({
      success: false,
      message: null,
      errors: {
        name: ['O nome precisa ter pelo menos 4 caracteres'],
        description: ['Descrição é obrigatória'],
      },
    })

    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    const submitButton = screen.getByRole('button', { name: /salvar projeto/i })

    await user.type(nameInput, 'ab')
    await user.click(submitButton)

    // Wait for field errors
    await screen.findByText(/o nome precisa ter pelo menos 4 caracteres/i)
    expect(
      screen.getByText(/o nome precisa ter pelo menos 4 caracteres/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument()
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

    mockCreateProjectAction.mockReturnValueOnce(actionPromise)

    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    const submitButton = screen.getByRole('button', { name: /salvar projeto/i })

    await user.type(nameInput, 'Meu Projeto')
    await user.click(submitButton)

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled()

    // Resolve the promise
    resolveAction?.({
      success: true,
      message: 'Projeto criado com sucesso',
      errors: null,
    })

    // Wait for the action to complete
    await screen.findByText(/tudo certo/i)
  })

  it('should invalidate projects query cache on success', async () => {
    const user = userEvent.setup()

    mockCreateProjectAction.mockResolvedValueOnce({
      success: true,
      message: 'Projeto criado com sucesso',
      errors: null,
    })

    render(<ProjectForm />)

    const nameInput = screen.getByLabelText(/nome do projeto/i)
    const submitButton = screen.getByRole('button', { name: /salvar projeto/i })

    await user.type(nameInput, 'Meu Projeto')
    await user.click(submitButton)

    // Wait for the action to complete and cache invalidation to be called
    await screen.findByText(/tudo certo/i)

    expect(mockInvalidateQueries).toHaveBeenCalledOnce()
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ['test-org', 'projects'],
    })
  })
})

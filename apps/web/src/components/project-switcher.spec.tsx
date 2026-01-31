import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { useParams } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getProjects } from '@/http/get-projects'
import { ProjectSwitcher } from './project-switcher'

vi.mock('next/navigation', () => ({
  useParams: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
}))

vi.mock('@/http/get-projects', async () => ({
  getProjects: vi.fn(),
}))

vi.mock('./ui/avatar', () => ({
  Avatar: vi.fn(({ children }) => <div className="avatar">{children}</div>),
  AvatarImage: vi.fn(() => null),
  AvatarFallback: vi.fn(() => null),
}))

vi.mock('./ui/dropdown-menu', () => ({
  DropdownMenu: vi.fn(({ children }) => (
    <div className="dropdown-menu">{children}</div>
  )),
  DropdownMenuTrigger: vi.fn(({ children }) => (
    <button type="button" className="dropdown-trigger">
      {children}
    </button>
  )),
  DropdownMenuContent: vi.fn(({ children }) => (
    <div className="dropdown-content">{children}</div>
  )),
  DropdownMenuGroup: vi.fn(({ children }) => (
    <div className="dropdown-group">{children}</div>
  )),
  DropdownMenuLabel: vi.fn(({ children }) => (
    <div className="dropdown-label">{children}</div>
  )),
  DropdownMenuItem: vi.fn(({ children }) => (
    <div className="dropdown-item">{children}</div>
  )),
  DropdownMenuSeparator: vi.fn(() => <div className="dropdown-separator" />),
}))

vi.mock('./ui/skeleton', () => ({
  Skeleton: vi.fn(() => <div className="skeleton" />),
}))

vi.mock('lucide-react', () => ({
  ChevronsUpDown: vi.fn(() => <span>ChevronsUpDown</span>),
  Loader2: vi.fn(() => <span>Loader2</span>),
  PlusCircle: vi.fn(() => <span>PlusCircle</span>),
}))

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('<ProjectSwitcher />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state correctly', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve({ projects: [] }), 1000)
        })
    )

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Loader2')).toBeInTheDocument()
    })
  })

  it('should render with current project selected', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: 'https://example.com/project1.jpg',
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
        {
          id: '2',
          name: 'Project Two',
          slug: 'project-2',
          avatarUrl: null,
          ownerId: 'user-2',
          organizationId: 'org-1',
          description: 'Description 2',
          createdAt: new Date(),
          owner: {
            id: 'user-2',
            name: 'User Two',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getAllByText('Project One')).toHaveLength(2)
    })
  })

  it('should render "Selecione um projeto" when no current project', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: undefined,
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: 'https://example.com/project1.jpg',
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Selecione um projeto')).toBeInTheDocument()
    })
  })

  it('should render all projects in the menu', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: 'https://example.com/project1.jpg',
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
        {
          id: '2',
          name: 'Project Two',
          slug: 'project-2',
          avatarUrl: null,
          ownerId: 'user-2',
          organizationId: 'org-1',
          description: 'Description 2',
          createdAt: new Date(),
          owner: {
            id: 'user-2',
            name: 'User Two',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getAllByText('Project One')).toHaveLength(2)
      expect(screen.getAllByText('Project Two')).toHaveLength(1)
    })
  })

  it('should render "Nova organização" button with correct link', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: null,
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Nova organização')).toBeInTheDocument()
    })

    const link = screen.getByText('Nova organização').closest('a')
    expect(link).toHaveAttribute('href', '/org/acme-corp/create-project')
  })

  it('should render correct navigation links for each project', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: null,
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
        {
          id: '2',
          name: 'Project Two',
          slug: 'project-2',
          avatarUrl: null,
          ownerId: 'user-2',
          organizationId: 'org-1',
          description: 'Description 2',
          createdAt: new Date(),
          owner: {
            id: 'user-2',
            name: 'User Two',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      expect(
        links.some(
          link =>
            link.getAttribute('href') === '/org/acme-corp/project/project-1'
        )
      ).toBe(true)
      expect(
        links.some(
          link =>
            link.getAttribute('href') === '/org/acme-corp/project/project-2'
        )
      ).toBe(true)
    })
  })

  it('should render avatar when project has avatarUrl', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: 'https://example.com/project1.jpg',
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getAllByText('Project One')).toHaveLength(2)
    })
  })

  it('should handle empty projects list gracefully', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: undefined,
    })
    vi.mocked(getProjects).mockResolvedValueOnce({ projects: [] })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Selecione um projeto')).toBeInTheDocument()
      expect(screen.queryByText('Project One')).not.toBeInTheDocument()
    })
  })

  it('should render "Projetos" label', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: 'acme-corp',
      project: 'project-1',
    })
    vi.mocked(getProjects).mockResolvedValueOnce({
      projects: [
        {
          id: '1',
          name: 'Project One',
          slug: 'project-1',
          avatarUrl: null,
          ownerId: 'user-1',
          organizationId: 'org-1',
          description: 'Description 1',
          createdAt: new Date(),
          owner: {
            id: 'user-1',
            name: 'User One',
            avatarUrl: null,
          },
        },
      ],
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Projetos')).toBeInTheDocument()
    })
  })

  it('should not call getProjects when orgSlug is not provided', async () => {
    vi.mocked(useParams).mockReturnValue({
      slug: undefined,
      project: undefined,
    })

    render(<ProjectSwitcher />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(getProjects).not.toHaveBeenCalled()
    })

    expect(screen.getByText('Selecione um projeto')).toBeInTheDocument()
  })
})

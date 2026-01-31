import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentOrganization } from '@/auth/auth'
import { getOrganizations } from '@/http/get-organizations'
import { OrganizationSwitcher } from './organization-switcher'

vi.mock('next/link', () => ({
  default: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
}))

vi.mock('@/auth/auth', async () => ({
  getCurrentOrganization: vi.fn().mockResolvedValue(null),
}))

vi.mock('@/http/get-organizations', async () => ({
  getOrganizations: vi.fn().mockResolvedValue({ organizations: [] }),
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

describe('<OrganizationSwitcher />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly with current organization selected', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce('acme-corp')
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp')).toHaveLength(2)
    })
  })

  it('should render "Selecione organizacao" when no current organization', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce(null)
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getByText('Selecione organizacao')).toBeInTheDocument()
    })
  })

  it('should render all organizations in the menu', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce('acme-corp')
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp')).toHaveLength(2)
      expect(screen.getAllByText('Tech Startup')).toHaveLength(1)
    })
  })

  it('should render "Nova organização" button with correct link', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce(null)
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getByText('Nova organização')).toBeInTheDocument()
    })
  })

  it('should render correct navigation links for each organization', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce('acme-corp')
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp')).toHaveLength(2)
      expect(screen.getAllByText('Tech Startup')).toHaveLength(1)
    })
  })

  it('should render avatar image when organization has avatarUrl', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce('acme-corp')
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getAllByText('Acme Corp')).toHaveLength(2)
    })
  })

  it('should render without avatar when organization has no avatarUrl', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce('tech-startup')
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getAllByText('Tech Startup')).toHaveLength(2)
    })
  })

  it('should handle empty organizations list gracefully', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce(null)
    vi.mocked(getOrganizations).mockResolvedValueOnce({ organizations: [] })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getByText('Selecione organizacao')).toBeInTheDocument()
      expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    })
  })

  it('should render "Organizacoes" label', async () => {
    vi.mocked(getCurrentOrganization).mockResolvedValueOnce(null)
    vi.mocked(getOrganizations).mockResolvedValueOnce({
      organizations: [
        {
          id: 'org-1',
          name: 'Acme Corp',
          slug: 'acme-corp',
          avatarUrl: 'https://example.com/acme.jpg',
        },
        {
          id: 'org-2',
          name: 'Tech Startup',
          slug: 'tech-startup',
          avatarUrl: null,
        },
      ],
    })

    render(await OrganizationSwitcher())

    await waitFor(() => {
      expect(screen.getByText('Organizacoes')).toBeInTheDocument()
    })
  })
})

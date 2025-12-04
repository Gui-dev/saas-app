import Link from 'next/link'
import { Button } from './ui/button'
import { getCurrentOrganization } from '@/auth/auth'
import { NavLink } from './nav-links'

export const Tabs = async () => {
  const currentOrg = await getCurrentOrganization()
  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-input"
          asChild
        >
          <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-input"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:text-foreground data-[current=true]:border-input"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/settings`}>
            Setting & Billing
          </NavLink>
        </Button>
      </nav>
    </div>
  )
}

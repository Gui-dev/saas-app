import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { getOrganizations } from '@/http/get-organizations'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { cookies } from 'next/headers'

export const OrganizationSwitcher = async () => {
  const cookieStore = await cookies()
  const currentOrg = cookieStore.get('org')
  const { organizations } = await getOrganizations()

  const currentOrganization = organizations.find(
    organization => organization.slug === currentOrg?.value
  )

  console.log('currentOrganization: ', currentOrganization)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] cursor-pointer items-center gap-2 rounded p-1 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrganization && (
          <>
            <Avatar className="mr-2 size-4">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate text-left">
              {currentOrganization.name}
            </span>
          </>
        )}
        {!currentOrganization && (
          <span className="text-muted-foreground">Selecione organizacao</span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizacoes</DropdownMenuLabel>
          {organizations.map(organization => {
            return (
              <DropdownMenuItem key={organization.id} asChild>
                <Link href={`/org/${organization.slug}`}>
                  <Avatar className="mr-2 size-4">
                    {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl} />
                    )}
                    <AvatarFallback />
                  </Avatar>
                  <span className="line-clamp-1">{organization.name}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" />
            Nova organização
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

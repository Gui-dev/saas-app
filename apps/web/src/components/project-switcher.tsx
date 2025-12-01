'use client'

import { ChevronsUpDown, Loader2, PlusCircle } from 'lucide-react'
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
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/http/get-projects'
import { Skeleton } from './ui/skeleton'

export const ProjectSwitcher = () => {
  const { slug, project: projectSlug } = useParams<{
    slug: string
    project: string
  }>()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(slug),
    enabled: !!slug,
  })

  const currentProject =
    data && projectSlug
      ? data.projects.find(project => project.slug === projectSlug)
      : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] cursor-pointer items-center gap-2 rounded p-1 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {isLoading && (
          <>
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </>
        )}

        {!isLoading && (
          <>
            {currentProject && (
              <>
                <Avatar className="size-4">
                  {currentProject.avatarUrl && (
                    <AvatarImage src={currentProject.avatarUrl} />
                  )}
                  <AvatarFallback />
                </Avatar>
                <span className="truncate text-left">
                  {currentProject.name}
                </span>
              </>
            )}
            {!currentProject && (
              <span className="text-muted-foreground">
                Selecione um projeto
              </span>
            )}
          </>
        )}
        {isLoading && <Loader2 className="animate-spin size-4 shrink-0" />}
        {!isLoading && (
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground shrink-0" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projetos</DropdownMenuLabel>

          {data &&
            data.projects.map(project => {
              return (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/org/${slug}/project/${project.slug}`}>
                    <Avatar className="mr-2 size-4">
                      {project.avatarUrl && (
                        <AvatarImage src={project.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{project.name}</span>
                  </Link>
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/org/${slug}/create-project`}>
            <PlusCircle className="mr-2 size-4" />
            Nova organização
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

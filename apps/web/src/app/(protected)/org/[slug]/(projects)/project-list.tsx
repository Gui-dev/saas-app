import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

import { getCurrentOrganization } from '@/auth/auth'
import { getProjects } from '@/http/get-projects'
import { getInitialsName } from '@/lib/get-initials-name'

export const ProjectList = async () => {
  const currentOrg = await getCurrentOrganization()
  const { projects } = await getProjects(currentOrg!)

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map(project => {
        return (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="font-semibold text-xl">
                {project.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 leading-relaxed">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-1.5">
              <Avatar className="size-4">
                {project.owner.avatarUrl && (
                  <AvatarImage src={project.owner.avatarUrl} />
                )}
                {!project.owner.avatarUrl && (
                  <AvatarFallback>
                    {getInitialsName(project.owner.name!)}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-muted-foreground text-xs">
                <span className="font-medium text-foreground">
                  {project.owner.name!}
                </span>{' '}
                {dayjs(project.createdAt).fromNow()}
              </p>

              <Button variant="outline" size="xs" className="text-xs">
                Acessar
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

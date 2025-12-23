import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ptBR from 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

import { getProjects } from '@/http/get-projects'
import { getInitialsName } from '@/lib/get-initials-name'
import { getCurrentOrganization } from '@/auth/auth'

export const ProjectList = async () => {
  const currentOrg = await getCurrentOrganization()
  const { projects } = await getProjects(currentOrg!)

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map(project => {
        return (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
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
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {project.owner.name!}
                </span>{' '}
                {dayjs(project.createdAt).fromNow()}
              </p>

              <Button variant="outline" size="xs" className="text-xs">
                Acessar
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

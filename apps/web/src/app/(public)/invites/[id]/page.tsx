import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckCircle, LogIn, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, isAuthenticated } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { acceptInvite } from '@/http/accept-invite'
import { getInvite } from '@/http/get-invite'
import { getInitialsName } from '@/lib/get-initials-name'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

interface IInvitesProps {
  params: Promise<{ id: string }>
}

const Invites = async ({ params }: IInvitesProps) => {
  const { id } = await params
  const { invite } = await getInvite({ inviteId: id })
  const isUserAuthenticated = await isAuthenticated()

  let currentUserEmail = null

  if (isUserAuthenticated) {
    const { user } = await auth()
    currentUserEmail = user.email
  }

  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email

  const handleSignInFromInvite = async () => {
    'use server'
    const cookieStore = await cookies()
    cookieStore.set('inviteId', id)

    redirect(`/sign-in?email=${invite.email}`)
  }

  const handleAcceptInviteAction = async () => {
    'use server'
    await acceptInvite({ inviteId: id })
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            {!invite.author?.avatarUrl && (
              <AvatarFallback>
                {getInitialsName(invite.author?.name!)}
              </AvatarFallback>
            )}
          </Avatar>
          <p className="text-balance text-center text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">
              {invite.author?.name ?? 'Alguém'}
            </span>{' '}
            convidou voce para se juntar a{' '}
            <span className="font-medium text-foreground">
              {invite.organization.name}
            </span>
            .{' '}
            <span className="font-medium text-foreground">
              {dayjs(invite.createdAt).fromNow()}
            </span>
          </p>
        </div>
        <Separator />
        {!isUserAuthenticated && (
          <form action={handleSignInFromInvite}>
            <Button
              type="submit"
              variant="secondary"
              className="w-full cursor-pointer"
            >
              <LogIn className="mr-2 size-4" />
              Entrar para aceitar o convite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <form action={handleAcceptInviteAction}>
            <Button
              type="submit"
              variant="secondary"
              className="w-full cursor-pointer"
            >
              <CheckCircle className="mr-2 size-4" />
              Se juntar à {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="tex-sm text-balance text-center text-muted-foreground">
              Este convite foi enviado para{' '}
              <span className="text-foreground text-medium">
                {invite.email}
              </span>
              , porém você está atualamente logado com{' '}
              <span className="text-foreground text-medium">
                {currentUserEmail}
              </span>
              .
            </p>

            <div className="space-y-2">
              <Button className="w-full" variant="secondary" asChild>
                <a href="/api/auth/sign-out">
                  <LogOut className="mr-2 size-4" />
                  Sair da conta {currentUserEmail}
                </a>
              </Button>

              <Button className="w-full" variant="outline" asChild>
                <Link href="/">Voltar ao Dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invites

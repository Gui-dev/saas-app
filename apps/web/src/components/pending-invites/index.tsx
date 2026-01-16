'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CheckIcon, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'
import { getPendingInvites } from '@/http/get-pending-invites'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)
dayjs.locale(ptBR)

export const PendingInvites = () => {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { data } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  const handleAcceptInvite = async (inviteId: string) => {
    await acceptInviteAction(inviteId)
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  const handleRejectInvite = async (inviteId: string) => {
    await rejectInviteAction(inviteId)
    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserPlus2 className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="font-medium text-sm">
          Convites pendentes ({data?.invites.length ?? 0})
        </span>

        {data?.invites.length === 0 && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            Não há convites pendentes.
          </p>
        )}

        {data?.invites.map(invite => {
          return (
            <div className="space-y-2" key={invite.id}>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <span className="font-medium text-foreground">
                  {invite.author?.name}
                </span>{' '}
                convidou voce para se juntar a{' '}
                <span className="font-medium text-foreground">
                  {invite.organization.name}
                </span>
                . <span>{dayjs(invite.createdAt).fromNow()}</span>
              </p>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  title="Aceitar convite"
                  onClick={() => handleAcceptInvite(invite.id)}
                >
                  <CheckIcon className="size-4 text-green-500" />
                  <span className="sr-only">Aceitar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  title="Recusar convite"
                  onClick={() => handleRejectInvite(invite.id)}
                >
                  <X className="size-4 text-red-500" />
                  <span className="sr-only">Recusar</span>
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

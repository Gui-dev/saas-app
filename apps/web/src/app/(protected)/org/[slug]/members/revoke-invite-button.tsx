import { Button } from '@/components/ui/button'
import { XOctagon } from 'lucide-react'
import { revokeInviteAction } from './actions'

interface IRevokeInviteButtonProps {
  inviteId: string
}

export const RevokeInviteButton = ({ inviteId }: IRevokeInviteButtonProps) => {
  return (
    <form action={revokeInviteAction.bind(null, { inviteId })}>
      <Button variant="destructive" size="sm" className="cursor-pointer">
        <XOctagon className="mr-2 size-4" />
        Revogar convite
      </Button>
    </form>
  )
}

import { ability } from '@/auth/auth'
import { Invites } from './invites'
import { MemberList } from './member-list'

const Members = async () => {
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl">Members</h1>

      <div className="spce-y-4">
        {permissions?.can('get', 'Invite') && <Invites />}
        {permissions?.can('get', 'User') && <MemberList />}
      </div>
    </div>
  )
}

export default Members

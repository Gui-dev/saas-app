import { organizationSchema } from '@saas/auth'
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'
import { ability, getCurrentOrganization } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'
import { getInitialsName } from '@/lib/get-initials-name'
import { removeMemberAction } from './actions'
import { UpdateMemberRoleSelect } from './update-member-role-select'

export const MemberList = async () => {
  const currentOrg = await getCurrentOrganization()
  const permissions = await ability()
  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    getMembers({ org: currentOrg! }),
    getOrganization({ org: currentOrg! }),
  ])
  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="semi-bold text-lg">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map(member => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 48 }}>
                    <Avatar className="size-8">
                      {member.avatarUrl && (
                        <AvatarImage src={member.avatarUrl} />
                      )}
                      {!member.avatarUrl && (
                        <AvatarFallback>
                          {getInitialsName(member.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {member.userId === membership?.userId && ' (me)'}
                        {organization.ownerId === member.userId && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                            <Crown className="size-4" />
                            Owner
                          </span>
                        )}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {permissions?.can(
                        'transfer-ownership',
                        authOrganization
                      ) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <ArrowLeftRight className="size-4" />
                          Transfer ownership
                        </Button>
                      )}

                      <UpdateMemberRoleSelect
                        memberId={member.id}
                        value={member.role}
                        disabled={
                          member.userId === membership?.userId ||
                          member.userId === organization.ownerId ||
                          permissions?.cannot('update', 'User')
                        }
                      />

                      {permissions?.can('delete', 'User') && (
                        <form
                          action={removeMemberAction.bind(null, {
                            memberId: member.id,
                          })}
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            disabled={
                              member.userId === membership?.userId ||
                              member.userId === organization.ownerId
                            }
                          >
                            <UserMinus className="mr-2 size-4" />
                            Remover
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

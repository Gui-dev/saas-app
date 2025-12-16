import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { ability, getCurrentOrganization } from '@/auth/auth'
import { getInvites } from '@/http/get-invites'
import { XOctagon } from 'lucide-react'
import { RevokeInviteButton } from './revoke-invite-button'

export const Invites = async () => {
  const currentOrg = await getCurrentOrganization()
  const permissions = await ability()
  const { invites } = await getInvites({ org: currentOrg! })

  return (
    <div className="space-y-4">
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Convidar membro
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h2 className="text-lg semi-bold">Convidados</h2>

        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map(invite => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <span className="text-muted-foreground">
                        {invite.email}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      {invite.role}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permissions?.can('delete', 'Invite') && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {invites.length === 0 && (
                <TableRow>
                  <TableCell className="py-2.5 text-center text-muted-foreground">
                    Não há convidados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

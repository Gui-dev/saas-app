'use client'

import type { Role } from '@saas/auth'
import type { ComponentProps } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateMemberAction } from './actions'

interface IUpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}

export const UpdateMemberRoleSelect = ({
  memberId,
  ...props
}: IUpdateMemberRoleSelectProps) => {
  const handleUpdateMemberRole = async (role: Role) => {
    await updateMemberAction({ memberId, role })
  }

  return (
    <Select onValueChange={handleUpdateMemberRole} {...props}>
      <SelectTrigger className="h-8 w-32" data-testid="role-select">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}

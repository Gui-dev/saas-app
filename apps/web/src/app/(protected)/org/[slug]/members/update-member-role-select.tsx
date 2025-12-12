'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ComponentProps } from 'react'
import { updateMemberAction } from './actions'
import { Role } from '@saas/auth'

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
      <SelectTrigger className="w-32 h-8">
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

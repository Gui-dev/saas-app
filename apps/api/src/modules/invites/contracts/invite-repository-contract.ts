import { Invite } from '@/generated/prisma'

export interface IFindByEmailAndOrganizationIdRequest {
  email: string
  organizationId: string
}

export interface ICreateInvite {
  organizationId: string
  authorId: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'BILLING'
}

export interface IInviteRepositoryContract {
  findByEmailAndOrganizationId(
    data: IFindByEmailAndOrganizationIdRequest
  ): Promise<Invite | null>
  create(data: ICreateInvite): Promise<Invite>
}

import { Invite, Prisma } from '@/generated/prisma'

export type IFindByInviteIdResponse = Prisma.InviteGetPayload<{
  select: {
    id: true
    email: true
    role: true
    createdAt: true
    author: {
      select: {
        id: true
        name: true
        avatarUrl: true
      }
    }
    organization: {
      select: {
        id: true
        name: true
      }
    }
  }
}>

export interface IFindByEmailAndOrganizationIdRequest {
  email: string
  organizationId: string
}

export type IFindByOrganizationIdResponse = Prisma.InviteGetPayload<{
  select: {
    id: true
    email: true
    role: true
    createdAt: true
    author: {
      select: {
        id: true
        name: true
      }
    }
  }
}>[]

export interface ICreateInvite {
  organizationId: string
  authorId: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'BILLING'
}

export interface IInviteRepositoryContract {
  findByInviteId(inviteId: string): Promise<IFindByInviteIdResponse | null>
  findByEmailAndOrganizationId(
    data: IFindByEmailAndOrganizationIdRequest
  ): Promise<Invite | null>
  findByOrganizationId(
    organizationId: string
  ): Promise<IFindByOrganizationIdResponse[]>
  create(data: ICreateInvite): Promise<Invite>
}

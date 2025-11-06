import { Member, Prisma } from '@/generated/prisma'

export interface IFindByMemberIdAndOrganizationId {
  memberId: string
  organizationId: string
}

export interface IFindByOrganizationIdAndUserId {
  organizationId: string
  userId: string
}

export interface IUpdateMemberByUserId {
  organizationId: string
  userId: string
  data: Partial<Omit<Member, 'id' | 'organizationId' | 'userId' | 'createdAt'>>
}

export interface IUpdateMemberByMemberId {
  memberId: string
  organizationId: string
  data: Partial<Omit<Member, 'id' | 'organizationId' | 'userId' | 'createdAt'>>
}

export type IFindByOrganizationIdResponse = Prisma.MemberGetPayload<{
  select: {
    id: true
    role: true
    user: {
      select: {
        id: true
        name: true
        email: true
        avatarUrl: true
      }
    }
  }
}>

export interface IFindByOrganizationIdAndUserEmail {
  organizationId: string
  email: string
}

export type IFindByOrganizationIdAndUserEmailResponse =
  Prisma.MemberGetPayload<{
    select: {
      id: true
      role: true
      user: {
        select: {
          id: true
          name: true
          email: true
          avatarUrl: true
        }
      }
    }
  }>

export interface IDeleteRequest {
  memberId: string
  organizationId: string
}

export interface IMemberRepositoryContract {
  findByMemberIdAndOrganizationId(
    data: IFindByMemberIdAndOrganizationId
  ): Promise<Member | null>
  findByOrganizationIdAndUserId(
    data: IFindByOrganizationIdAndUserId
  ): Promise<Member | null>
  findByOrganizationId(
    organizationId: string
  ): Promise<IFindByOrganizationIdResponse[]>
  findByOrganizationIdAndUserEmail(
    data: IFindByOrganizationIdAndUserEmail
  ): Promise<IFindByOrganizationIdAndUserEmailResponse | null>
  updateByUserId(data: IUpdateMemberByUserId): Promise<Member>
  updateByMemberId(data: IUpdateMemberByMemberId): Promise<Member>
  delete(data: IDeleteRequest): Promise<void>
  count(organizationId: string): Promise<number>
}

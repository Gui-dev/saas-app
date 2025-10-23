import { Member } from '@/generated/prisma'

export interface IFindByOrganizationIdAndUserId {
  organizationId: string
  userId: string
}

export interface IUpdateMember {
  organizationId: string
  userId: string
  data: Partial<Omit<Member, 'id' | 'organizationId' | 'userId' | 'createdAt'>>
}

export interface IMemberRepositoryContract {
  findByOrganizationIdAndUserId(
    data: IFindByOrganizationIdAndUserId
  ): Promise<Member | null>
  update(data: IUpdateMember): Promise<Member>
}

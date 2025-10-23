import { Member } from '@/generated/prisma'
import {
  IFindByOrganizationIdAndUserId,
  IMemberRepositoryContract,
  IUpdateMember,
} from '../contracts/member-repository-contract'
import { prisma } from '@/lib/prisma'

export class MemberRepository implements IMemberRepositoryContract {
  public async findByOrganizationIdAndUserId({
    organizationId,
    userId,
  }: IFindByOrganizationIdAndUserId): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
    })

    return member
  }

  public async update({
    organizationId,
    userId,
    data,
  }: IUpdateMember): Promise<Member> {
    const member = await prisma.member.update({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
      data: {
        ...data,
      },
    })

    return member
  }
}

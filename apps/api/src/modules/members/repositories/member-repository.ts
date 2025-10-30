import { Member } from '@/generated/prisma'
import {
  IDeleteRequest,
  IFindByMemberIdAndOrganizationId,
  IFindByOrganizationIdAndUserId,
  IFindByOrganizationIdResponse,
  IMemberRepositoryContract,
  IUpdateMemberByMemberId,
  IUpdateMemberByUserId,
} from '../contracts/member-repository-contract'
import { prisma } from '@/lib/prisma'

export class MemberRepository implements IMemberRepositoryContract {
  public async findByMemberIdAndOrganizationId({
    memberId,
    organizationId,
  }: IFindByMemberIdAndOrganizationId): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        organizationId,
      },
    })

    return member
  }

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

  public async findByOrganizationId(
    organizationId: string
  ): Promise<IFindByOrganizationIdResponse[]> {
    const members = await prisma.member.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    })

    return members
  }

  public async updateByUserId({
    organizationId,
    userId,
    data,
  }: IUpdateMemberByUserId): Promise<Member> {
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

  public async updateByMemberId({
    memberId,
    organizationId,
    data,
  }: IUpdateMemberByMemberId): Promise<Member> {
    const member = await prisma.member.update({
      where: {
        id: memberId,
        organizationId,
      },
      data: {
        ...data,
      },
    })

    return member
  }

  public async delete({
    memberId,
    organizationId,
  }: IDeleteRequest): Promise<void> {
    await prisma.member.delete({
      where: {
        id: memberId,
        organizationId,
      },
    })
  }
}

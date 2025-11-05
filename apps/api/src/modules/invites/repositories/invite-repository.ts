import { Invite } from '@/generated/prisma'
import {
  IAcceptInviteRequest,
  ICreateInvite,
  IFindByEmailAndOrganizationIdRequest,
  IFindByInviteIdResponse,
  IFindByOrganizationIdResponse,
  IFindByUserEmailResponse,
  IInviteRepositoryContract,
} from '../contracts/invite-repository-contract'
import { prisma } from '@/lib/prisma'

export class InviteRepository implements IInviteRepositoryContract {
  public async findByInviteId(
    inviteId: string
  ): Promise<IFindByInviteIdResponse | null> {
    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return invite
  }
  public async findByEmailAndOrganizationId({
    email,
    organizationId,
  }: IFindByEmailAndOrganizationIdRequest): Promise<Invite | null> {
    const invite = await prisma.invite.findUnique({
      where: {
        email_organizationId: {
          email,
          organizationId,
        },
      },
    })

    return invite
  }

  public async findByOrganizationId(
    organizationId: string
  ): Promise<IFindByOrganizationIdResponse[]> {
    const invites = await prisma.invite.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return invites
  }

  public async findByUserEmail(
    email: string
  ): Promise<IFindByUserEmailResponse[]> {
    const invites = await prisma.invite.findMany({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return invites
  }

  public async create({
    organizationId,
    authorId,
    email,
    role,
  }: ICreateInvite): Promise<Invite> {
    const invite = await prisma.invite.create({
      data: {
        organizationId,
        authorId,
        email,
        role,
      },
    })

    return invite
  }

  public async acceptInvite({
    inviteId,
    userId,
    organizationId,
    role,
  }: IAcceptInviteRequest): Promise<void> {
    await prisma.$transaction([
      prisma.member.create({
        data: {
          userId,
          organizationId,
          role,
        },
      }),
      prisma.invite.delete({
        where: {
          id: inviteId,
        },
      }),
    ])
  }

  public async delete(inviteId: string): Promise<void> {
    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    })
  }
}

import { Invite } from '@/generated/prisma'
import {
  ICreateInvite,
  IFindByEmailAndOrganizationIdRequest,
  IFindByInviteIdResponse,
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
}

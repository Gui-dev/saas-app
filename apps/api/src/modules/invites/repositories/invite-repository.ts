import { Invite } from '@/generated/prisma'
import {
  ICreateInvite,
  IFindByEmailAndOrganizationIdRequest,
  IInviteRepositoryContract,
} from '../contracts/invite-repository-contract'
import { prisma } from '@/lib/prisma'

export class InviteRepository implements IInviteRepositoryContract {
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

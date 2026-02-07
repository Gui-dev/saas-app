import { randomUUID } from 'node:crypto'
import type { Invite } from '@/generated/prisma'
import type {
  IAcceptInviteRequest,
  ICreateInvite,
  IFindByEmailAndOrganizationIdRequest,
  IFindByInviteIdResponse,
  IFindByOrganizationIdResponse,
  IFindByUserEmailResponse,
  IInviteRepositoryContract,
} from '../../contracts/invite-repository-contract'

export class InMemoryInviteRepository implements IInviteRepositoryContract {
  private items: Invite[] = []

  public async findByInviteId(
    inviteId: string
  ): Promise<IFindByInviteIdResponse | null> {
    const invite = this.items.find(item => item.id === inviteId)

    if (!invite) {
      return null
    }

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      createdAt: invite.createdAt,
      author: {
        id: invite.authorId,
        name: invite.author?.name || '',
        avatarUrl: invite.author?.avatarUrl || '',
      },
      organization: {
        id: invite.organizationId,
        name: invite.organization?.name || '',
      },
    }
  }

  public async findByEmailAndOrganizationId({
    email,
    organizationId,
  }: IFindByEmailAndOrganizationIdRequest): Promise<Invite | null> {
    const invite = this.items.find(
      item => item.email === email && item.organizationId === organizationId
    )

    if (!invite) {
      return null
    }

    return invite
  }

  public async findByOrganizationId(
    organizationId: string
  ): Promise<IFindByOrganizationIdResponse[]> {
    const invites = this.items.filter(
      item => item.organizationId === organizationId
    )

    return invites.map(invite => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      createdAt: invite.createdAt,
      author: {
        id: invite.authorId,
        name: invite.author?.name || '',
      },
    }))
  }

  public async findByUserEmail(
    email: string
  ): Promise<IFindByUserEmailResponse[]> {
    const invites = this.items.filter(item => item.email === email)

    return invites.map(invite => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      createdAt: invite.createdAt,
      author: {
        id: invite.authorId,
        name: invite.author?.name || '',
        avatarUrl: invite.author?.avatarUrl || '',
      },
      organization: {
        id: invite.organizationId,
        name: invite.organization?.name || '',
      },
    }))
  }

  public async create(data: ICreateInvite): Promise<Invite> {
    const invite = {
      id: randomUUID(),
      organizationId: data.organizationId,
      authorId: data.authorId,
      email: data.email,
      role: data.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(invite)

    return invite
  }

  public async acceptInvite(data: IAcceptInviteRequest): Promise<void> {
    const inviteIndex = this.items.findIndex(item => item.id === data.inviteId)

    if (inviteIndex !== -1) {
      this.items.splice(inviteIndex, 1)
    }
  }

  public async delete(inviteId: string): Promise<void> {
    const inviteIndex = this.items.findIndex(item => item.id === inviteId)

    if (inviteIndex !== -1) {
      this.items.splice(inviteIndex, 1)
    }
  }

  public getItems(): Invite[] {
    return this.items
  }

  public setItems(items: Invite[]) {
    this.items = items
  }
}

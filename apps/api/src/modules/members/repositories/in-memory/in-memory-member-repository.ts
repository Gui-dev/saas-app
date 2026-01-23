import type { Member } from '@/generated/prisma'
import type {
  IDeleteRequest,
  IFindByMemberIdAndOrganizationId,
  IFindByOrganizationIdAndUserEmail,
  IFindByOrganizationIdAndUserEmailResponse,
  IFindByOrganizationIdAndUserId,
  IFindByOrganizationIdResponse,
  IMemberRepositoryContract,
  IUpdateMemberByMemberId,
  IUpdateMemberByUserId,
} from '../../contracts/member-repository-contract'

export class InMemoryMemberRepository implements IMemberRepositoryContract {
  private items: Member[] = []

  public async findByMemberIdAndOrganizationId({
    memberId,
    organizationId,
  }: IFindByMemberIdAndOrganizationId): Promise<Member | null> {
    const member = this.items.find(
      item => item.id === memberId && item.organizationId === organizationId
    )

    if (!member) {
      return null
    }

    return member
  }

  public async findByOrganizationIdAndUserId({
    organizationId,
    userId,
  }: IFindByOrganizationIdAndUserId): Promise<Member | null> {
    const member = this.items.find(
      item => item.organizationId === organizationId && item.userId === userId
    )

    if (!member) {
      return null
    }

    return member
  }

  public async findByOrganizationId(
    organizationId: string
  ): Promise<IFindByOrganizationIdResponse[]> {
    const members = this.items.filter(
      item => item.organizationId === organizationId
    )

    return members.map(member => ({
      id: member.id,
      role: member.role,
      user: {
        id: member.userId,
        name: member.user?.name || '',
        email: member.user?.email || '',
        avatarUrl: member.user?.avatarUrl || '',
      },
    }))
  }

  public async findByOrganizationIdAndUserEmail({
    organizationId,
    email,
  }: IFindByOrganizationIdAndUserEmail): Promise<IFindByOrganizationIdAndUserEmailResponse | null> {
    const member = this.items.find(
      item =>
        item.organizationId === organizationId && item.user?.email === email
    )

    if (!member) {
      return null
    }

    return {
      id: member.id,
      role: member.role,
      user: {
        id: member.userId,
        name: member.user?.name || '',
        email: member.user?.email || '',
        avatarUrl: member.user?.avatarUrl || '',
      },
    }
  }

  public async updateByUserId({
    organizationId,
    userId,
    data,
  }: IUpdateMemberByUserId): Promise<Member> {
    const memberIndex = this.items.findIndex(
      item => item.organizationId === organizationId && item.userId === userId
    )

    if (memberIndex === -1) {
      throw new Error('Member not found')
    }

    const updatedMember: Member = {
      ...this.items[memberIndex],
      ...data,
    }

    this.items[memberIndex] = updatedMember

    return updatedMember
  }

  public async updateByMemberId({
    memberId,
    organizationId,
    data,
  }: IUpdateMemberByMemberId): Promise<Member> {
    const memberIndex = this.items.findIndex(
      item => item.id === memberId && item.organizationId === organizationId
    )

    if (memberIndex === -1) {
      throw new Error('Member not found')
    }

    const updatedMember: Member = {
      ...this.items[memberIndex],
      ...data,
    }

    this.items[memberIndex] = updatedMember

    return updatedMember
  }

  public async delete({
    memberId,
    organizationId,
  }: IDeleteRequest): Promise<void> {
    const memberIndex = this.items.findIndex(
      item => item.id === memberId && item.organizationId === organizationId
    )

    if (memberIndex !== -1) {
      this.items.splice(memberIndex, 1)
    }
  }

  public async count(organizationId: string): Promise<number> {
    return this.items.filter(item => item.organizationId === organizationId)
      .length
  }

  public getItems(): Member[] {
    return this.items
  }

  public setItems(items: Member[]) {
    this.items = items
  }
}

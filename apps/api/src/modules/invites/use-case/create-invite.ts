import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IMemberRepositoryContract } from '@/modules/members/contracts/member-repository-contract'
import type { IInviteRepositoryContract } from '../contracts/invite-repository-contract'

export interface ICreateInviteUseCaseRequest {
  organizationId: string
  authorId: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'BILLING'
}

export class CreateInviteUseCase {
  constructor(
    private inviteRepository: IInviteRepositoryContract,
    private memberRepository: IMemberRepositoryContract
  ) {}

  public async execute({
    organizationId,
    authorId,
    email,
    role,
  }: ICreateInviteUseCaseRequest) {
    const inviteWithSameEmail =
      await this.inviteRepository.findByEmailAndOrganizationId({
        email,
        organizationId,
      })

    if (inviteWithSameEmail) {
      throw new BadRequestError('Another invite with same email already exists')
    }

    const memberWithSameEmail =
      await this.memberRepository.findByOrganizationIdAndUserEmail({
        organizationId,
        email,
      })

    if (memberWithSameEmail) {
      throw new BadRequestError('Member with same email already exists')
    }

    const invite = await this.inviteRepository.create({
      organizationId,
      authorId,
      email,
      role,
    })

    return {
      inviteId: invite.id,
    }
  }
}

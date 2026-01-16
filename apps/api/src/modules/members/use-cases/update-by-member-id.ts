import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IMemberRepositoryContract } from '../contracts/member-repository-contract'

export interface IUpdateByMemberIdUseCaseRequest {
  memberId: string
  organizationId: string
  role: 'ADMIN' | 'MEMBER' | 'BILLING'
}

export class UpdateByMemberIdUseCase {
  constructor(private memberRepository: IMemberRepositoryContract) {}

  public async execute({
    memberId,
    organizationId,
    role,
  }: IUpdateByMemberIdUseCaseRequest) {
    const member = await this.memberRepository.updateByMemberId({
      memberId,
      organizationId,
      data: {
        role,
      },
    })

    if (!member) {
      throw new BadRequestError('Member not found')
    }

    return {
      memberId: member.id,
    }
  }
}

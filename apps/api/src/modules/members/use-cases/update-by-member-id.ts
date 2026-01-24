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
    try {
      const member = await this.memberRepository.updateByMemberId({
        memberId,
        organizationId,
        data: {
          role,
        },
      })

      return {
        memberId: member.id,
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Member not found') {
        throw new BadRequestError('Member not found')
      }
      throw error
    }
  }
}

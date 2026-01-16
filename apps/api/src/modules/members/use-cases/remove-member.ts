import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IMemberRepositoryContract } from '../contracts/member-repository-contract'

export interface IRemoveMemberUseCaseRequest {
  memberId: string
  organizationId: string
}

export class RemoveMemberUseCase {
  constructor(private memberRepository: IMemberRepositoryContract) {}

  public async execute({
    memberId,
    organizationId,
  }: IRemoveMemberUseCaseRequest) {
    const member = await this.memberRepository.findByMemberIdAndOrganizationId({
      memberId,
      organizationId,
    })

    if (!member) {
      throw new BadRequestError('Member not found')
    }

    await this.memberRepository.delete({
      memberId,
      organizationId,
    })
  }
}

import { MemberRepository } from '../repositories/member-repository'
import {
  IUpdateByMemberIdUseCaseRequest,
  UpdateByMemberIdUseCase,
} from '../use-cases/update-by-member-id'

export const makeUpdateByMemberId = async ({
  memberId,
  organizationId,
  role,
}: IUpdateByMemberIdUseCaseRequest) => {
  const memberRepository = new MemberRepository()
  const updateByMemberIdUseCase = new UpdateByMemberIdUseCase(memberRepository)
  const member = await updateByMemberIdUseCase.execute({
    memberId,
    organizationId,
    role,
  })

  return {
    memberId: member.memberId,
  }
}

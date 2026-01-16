import { MemberRepository } from '../repositories/member-repository'
import {
  type IRemoveMemberUseCaseRequest,
  RemoveMemberUseCase,
} from '../use-cases/remove-member'

export const makeRemoveMember = async ({
  memberId,
  organizationId,
}: IRemoveMemberUseCaseRequest) => {
  const memberRepository = new MemberRepository()
  const removeMemberUseCase = new RemoveMemberUseCase(memberRepository)
  await removeMemberUseCase.execute({
    memberId,
    organizationId,
  })
}

import { MemberRepository } from '../repositories/member-repository'
import {
  GetMembersUseCase,
  type IGetMembersUseCaseRequest,
} from '../use-cases/get-members'

export const makeGetMembers = async ({
  organizationId,
}: IGetMembersUseCaseRequest) => {
  const memberRepository = new MemberRepository()
  const getMembersUseCase = new GetMembersUseCase(memberRepository)
  const { members } = await getMembersUseCase.execute({ organizationId })

  return {
    members,
  }
}

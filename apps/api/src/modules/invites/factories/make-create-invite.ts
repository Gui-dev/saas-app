import { MemberRepository } from '@/modules/members/repositories/member-repository'
import { InviteRepository } from '../repositories/invite-repository'
import {
  CreateInviteUseCase,
  ICreateInviteUseCaseRequest,
} from '../use-case/create-invite'

export const makeCreateInvite = async ({
  organizationId,
  authorId,
  email,
  role,
}: ICreateInviteUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const memberRepository = new MemberRepository()
  const createInviteUseCase = new CreateInviteUseCase(
    inviteRepository,
    memberRepository
  )
  const { inviteId } = await createInviteUseCase.execute({
    organizationId,
    authorId,
    email,
    role,
  })
  return {
    inviteId,
  }
}

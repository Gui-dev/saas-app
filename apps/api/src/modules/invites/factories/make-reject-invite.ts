import { UserRepository } from '@/modules/users/repositories/user-repository'
import { InviteRepository } from '../repositories/invite-repository'
import {
  IRejectInviteUseCaseRequest,
  RejectInviteUseCase,
} from '../use-case/reject-invite'

export const makeRejectInvite = async ({
  inviteId,
  userId,
}: IRejectInviteUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const userRepository = new UserRepository()
  const rejectInviteUsecase = new RejectInviteUseCase(
    inviteRepository,
    userRepository
  )
  await rejectInviteUsecase.execute({ inviteId, userId })
}

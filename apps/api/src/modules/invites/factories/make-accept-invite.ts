import { UserRepository } from '@/modules/users/repositories/user-repository'
import { InviteRepository } from '../repositories/invite-repository'
import {
  AcceptInviteUseCase,
  IAcceptInviteUseCaseRequest,
} from '../use-case/accept-invite'

export const makeAcceptInvite = async ({
  inviteId,
  userId,
}: IAcceptInviteUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const userRepository = new UserRepository()
  const acceptInviteUsecase = new AcceptInviteUseCase(
    inviteRepository,
    userRepository
  )
  await acceptInviteUsecase.execute({ inviteId, userId })
}

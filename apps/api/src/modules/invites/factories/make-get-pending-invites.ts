import { UserRepository } from '@/modules/users/repositories/user-repository'
import { InviteRepository } from '../repositories/invite-repository'
import {
  GetPendingInvitesUseCase,
  type IGetPendingInvitesUseCaseRequest,
} from '../use-case/get-pending-invites'

export const makeGetPendingInvites = async ({
  userId,
}: IGetPendingInvitesUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const userRepository = new UserRepository()
  const getPendingInvitesUsecase = new GetPendingInvitesUseCase(
    inviteRepository,
    userRepository
  )
  const { invites } = await getPendingInvitesUsecase.execute({ userId })

  return {
    invites,
  }
}

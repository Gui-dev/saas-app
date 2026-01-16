import { InviteRepository } from '../repositories/invite-repository'
import {
  type IRevokeInviteUseCaseRequest,
  RevokeInviteUseCase,
} from '../use-case/revoke-invite'

export const makeRevokeInvite = async ({
  inviteId,
}: IRevokeInviteUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const revokeInviteUsecase = new RevokeInviteUseCase(inviteRepository)
  await revokeInviteUsecase.execute({ inviteId })
}

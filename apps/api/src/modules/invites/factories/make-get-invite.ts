import { InviteRepository } from '../repositories/invite-repository'
import {
  GetInviteUseCase,
  IGetInviteUseCaseRequest,
} from '../use-case/get-invite'

export const makeGetInvite = async ({ inviteId }: IGetInviteUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const getInviteUseCase = new GetInviteUseCase(inviteRepository)
  const { invite } = await getInviteUseCase.execute({ inviteId })

  return {
    invite,
  }
}

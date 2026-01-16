import { InviteRepository } from '../repositories/invite-repository'
import {
  GetInvitesUseCase,
  type IGetInvitesUseCaseRequest,
} from '../use-case/get-invites'

export const makeGetInvites = async ({
  organizationId,
}: IGetInvitesUseCaseRequest) => {
  const inviteRepository = new InviteRepository()
  const getInvitesUseCase = new GetInvitesUseCase(inviteRepository)
  const { invites } = await getInvitesUseCase.execute({ organizationId })

  return {
    invites,
  }
}

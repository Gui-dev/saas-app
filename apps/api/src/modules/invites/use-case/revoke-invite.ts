import { BadRequestError } from '@/http/_errors/bad-request-error'
import { IInviteRepositoryContract } from '../contracts/invite-repository-contract'

export interface IRevokeInviteUseCaseRequest {
  inviteId: string
}

export class RevokeInviteUseCase {
  constructor(private inviteRepository: IInviteRepositoryContract) {}

  public async execute({ inviteId }: IRevokeInviteUseCaseRequest) {
    const invite = await this.inviteRepository.findByInviteId(inviteId)

    if (!invite) {
      throw new BadRequestError('Invite not found or expired')
    }

    await this.inviteRepository.delete(inviteId)
  }
}

import { BadRequestError } from '@/http/_errors/bad-request-error'
import { IInviteRepositoryContract } from '../contracts/invite-repository-contract'

export interface IGetInviteUseCaseRequest {
  inviteId: string
}

export class GetInviteUseCase {
  constructor(private readonly inviteRepository: IInviteRepositoryContract) {}

  public async execute({ inviteId }: IGetInviteUseCaseRequest) {
    const invite = await this.inviteRepository.findByInviteId(inviteId)

    if (!invite) {
      throw new BadRequestError('Invite not found')
    }

    return {
      invite,
    }
  }
}

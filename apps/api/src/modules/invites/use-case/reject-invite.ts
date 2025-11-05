import { BadRequestError } from '@/http/_errors/bad-request-error'
import { IInviteRepositoryContract } from '../contracts/invite-repository-contract'
import { IUserRepositoryContract } from '@/modules/users/contracts/user-repository-contract'

export interface IRejectInviteUseCaseRequest {
  inviteId: string
  userId: string
}

export class RejectInviteUseCase {
  constructor(
    private inviteRepository: IInviteRepositoryContract,
    private userRepository: IUserRepositoryContract
  ) {}

  public async execute({ inviteId, userId }: IRejectInviteUseCaseRequest) {
    const invite = await this.inviteRepository.findByInviteId(inviteId)

    if (!invite) {
      throw new BadRequestError('Invite not found or expired')
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new BadRequestError('User not found')
    }

    if (invite.email !== user.email) {
      throw new BadRequestError('This invite belongs to another user')
    }

    await this.inviteRepository.delete(inviteId)
  }
}

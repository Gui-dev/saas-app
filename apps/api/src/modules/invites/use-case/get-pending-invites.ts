import { IUserRepositoryContract } from '@/modules/users/contracts/user-repository-contract'
import { IInviteRepositoryContract } from '../contracts/invite-repository-contract'
import { BadRequestError } from '@/http/_errors/bad-request-error'

export interface IGetPendingInvitesUseCaseRequest {
  userId: string
}

export class GetPendingInvitesUseCase {
  constructor(
    private inviteRepository: IInviteRepositoryContract,
    private userRepository: IUserRepositoryContract
  ) {}

  public async execute({ userId }: IGetPendingInvitesUseCaseRequest) {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new BadRequestError('User not found')
    }

    const invites = await this.inviteRepository.findByUserEmail(user.email)

    return {
      invites,
    }
  }
}

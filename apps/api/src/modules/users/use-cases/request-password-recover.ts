import type { ITokenRepositoryContract } from '@/modules/token/contracts/token-repository-contract'
import type { IUserRepositoryContract } from '../contracts/user-repository-contract'

export class RequestPasswordRecoverUseCase {
  constructor(
    private userRepository: IUserRepositoryContract,
    private tokenRepository: ITokenRepositoryContract
  ) {}

  public async execute(email: string): Promise<{ tokenId: string } | null> {
    const userFromEmail = await this.userRepository.findByEmail(email)

    if (!userFromEmail) {
      return null
    }

    const token = await this.tokenRepository.create({
      type: 'PASSWORD_RECOVER',
      userId: userFromEmail?.id,
    })

    return {
      tokenId: token.id,
    }
  }
}

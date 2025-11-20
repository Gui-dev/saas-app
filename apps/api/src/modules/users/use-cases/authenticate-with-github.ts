import { BadRequestError } from '@/http/_errors/bad-request-error'
import { IUserRepositoryContract } from '../contracts/user-repository-contract'
import { IAccountRepositoryContract } from '@/modules/accounts/contracts/account-repository-contract'

export interface IAuthenticateWithGithubRequest {
  githubId: string
  name: string | undefined
  email: string | null
  avatar_url: string | null
}

export class AuthenticateWithGithubUseCase {
  constructor(
    private userRepository: IUserRepositoryContract,
    private accountRepository: IAccountRepositoryContract
  ) {}

  public async execute({
    githubId,
    name,
    email,
    avatar_url,
  }: IAuthenticateWithGithubRequest) {
    if (!email) {
      throw new BadRequestError('Your Github account does not have an email')
    }

    let user = await this.userRepository.findByEmail(email)

    if (!user) {
      user = await this.userRepository.create({
        name,
        email,
        avatarUrl: avatar_url,
      })
    }

    let account = await this.accountRepository.findByUserId(user.id)

    if (!account) {
      account = await this.accountRepository.create({
        userId: user.id,
        providerAccountId: githubId,
        provider: 'GITHUB',
      })
    }

    return {
      userId: user.id,
    }
  }
}

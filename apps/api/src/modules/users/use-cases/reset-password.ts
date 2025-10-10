import { ITokenRepositoryContract } from '@/modules/token/contracts/token-repository-contract'
import { IUserRepositoryContract } from '../contracts/user-repository-contract'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import { hash } from 'bcryptjs'

export interface IResetPasswordUseCaseRequest {
  code: string
  password: string
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: IUserRepositoryContract,
    private tokenRepository: ITokenRepositoryContract
  ) {}

  public async execute({
    code,
    password,
  }: IResetPasswordUseCaseRequest): Promise<void> {
    const token = await this.tokenRepository.findById(code)

    if (!token) {
      throw new UnauthorizedError('Unauthorized')
    }

    const passwordHash = await hash(password, 6)

    await this.usersRepository.update({
      userId: token.userId,
      data: {
        passwordHash,
      },
    })
  }
}

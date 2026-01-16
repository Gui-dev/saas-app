import { hash } from 'bcryptjs'
import { UnauthorizedError } from '@/http/_errors/unauthorized-error'
import type { ITokenRepositoryContract } from '@/modules/token/contracts/token-repository-contract'
import type { IUserRepositoryContract } from '../contracts/user-repository-contract'

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
      code,
      userId: token.userId,
      data: {
        passwordHash,
      },
    })
  }
}

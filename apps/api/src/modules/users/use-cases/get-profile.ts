import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IUserRepositoryContract } from '../contracts/user-repository-contract'

interface IGetProfileUseCaseRequest {
  id: string
}

export class GetProfileUseCase {
  constructor(private userRepository: IUserRepositoryContract) {}

  public async execute({ id }: IGetProfileUseCaseRequest) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new BadRequestError('User not found')
    }

    return {
      user,
    }
  }
}

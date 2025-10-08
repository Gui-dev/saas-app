import type { IUserRepositoryContract } from '../contracts/user-repository-contract'

interface IGetProfileUseCaseRequest {
  id: string
}

export class GetProfileUseCase {
  constructor(private userRepository: IUserRepositoryContract) {}

  public async execute({ id }: IGetProfileUseCaseRequest) {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new Error('User not found')
    }

    return {
      user,
    }
  }
}

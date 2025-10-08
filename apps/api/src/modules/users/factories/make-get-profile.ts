import { UserRepository } from '../repositories/user-repository'
import { GetProfileUseCase } from '../use-cases/get-profile'

interface IGetProfileRequest {
  id: string
}

export const makeGetProfile = async ({ id }: IGetProfileRequest) => {
  const userRepository = new UserRepository()
  const getProfile = new GetProfileUseCase(userRepository)
  const { user } = await getProfile.execute({ id })

  return {
    user,
  }
}

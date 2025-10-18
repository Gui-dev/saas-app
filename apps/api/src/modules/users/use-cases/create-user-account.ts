import { hash } from 'bcryptjs'
import type { IOrganizationRepositoryContract } from '@/modules/organization/contracts/organization-repository-contract'
import type {
  ICreateUser,
  IUserRepositoryContract,
} from '../contracts/user-repository-contract'
import { BadRequestError } from '@/http/_errors/bad-request-error'

interface ICreateUserAccountResponse {
  id: string
}

interface ICreateUserAccountRequest {
  name: string
  email: string
  password: string
}

export class CreateUserAccountUseCase {
  constructor(
    private userRepository: IUserRepositoryContract,
    private organizationRepository: IOrganizationRepositoryContract
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserAccountRequest): Promise<ICreateUserAccountResponse> {
    const userAlreadyExists = await this.userRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new BadRequestError('User already exists')
    }

    const [_, domain] = email.split('@')
    const autoJoinOrganization =
      await this.organizationRepository.findByDomainAndAttachUsersByDomain(
        domain
      )

    const passwordHashed = await hash(password, 6)

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHashed,
      organization: autoJoinOrganization,
    })

    return {
      id: user.id,
    }
  }
}

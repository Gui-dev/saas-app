import { User } from '@/generated/prisma'
import {
  type ICreateUser,
  type IUserRepositoryContract,
} from '../contracts/user-repository-contract'
import { prisma } from '@/lib/prisma'

export class UserRepository implements IUserRepositoryContract {
  public async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password,
      },
    })

    return user
  }
}

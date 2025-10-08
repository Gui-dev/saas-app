import type { Organization, User } from '@/generated/prisma'

export interface ICreateUser {
  name: string
  email: string
  password: string
  organization: Organization | null
}

export interface IUserRepositoryContract {
  findByEmail(email: string): Promise<User | null>
  create(data: ICreateUser): Promise<User>
}

import type { Organization, Prisma, User } from '@/generated/prisma'

export interface ICreateUser {
  name: string
  email: string
  password: string
  organization: Organization | null
}

export type FindByIdResponse = Prisma.UserGetPayload<{
  select: { id: true; name: true; email: true; avatarUrl: true }
}>

export interface IUserRepositoryContract {
  findById(id: string): Promise<FindByIdResponse | null>
  findByEmail(email: string): Promise<User | null>
  create(data: ICreateUser): Promise<User>
}

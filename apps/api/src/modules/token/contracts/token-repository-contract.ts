import { Token } from '@/generated/prisma'

export interface ICreateToken {
  type: 'PASSWORD_RECOVER'
  userId: string
}

export interface ITokenRepositoryContract {
  create: (data: ICreateToken) => Promise<Token>
}

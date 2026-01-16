import type { Token } from '@/generated/prisma'

export interface ICreateToken {
  type: 'PASSWORD_RECOVER'
  userId: string
}

export interface ITokenRepositoryContract {
  findById(tokenId: string): Promise<Token | null>
  create: (data: ICreateToken) => Promise<Token>
}

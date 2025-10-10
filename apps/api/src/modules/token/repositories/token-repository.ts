import { prisma } from '@/lib/prisma'
import {
  ICreateToken,
  ITokenRepositoryContract,
} from '../contracts/token-repository-contract'
import { Token } from '@/generated/prisma'

export class TokenRepository implements ITokenRepositoryContract {
  public async findById(tokenId: string): Promise<Token | null> {
    const token = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
    })

    return token
  }

  public async create({ type, userId }: ICreateToken): Promise<Token> {
    const token = await prisma.token.create({
      data: {
        type,
        userId,
      },
    })

    return token
  }
}

import { randomUUID } from 'node:crypto'

import type { User } from '@/generated/prisma'
import type {
  FindByIdResponse,
  ICreateUser,
  IUpdateUser,
  IUserRepositoryContract,
} from '../../contracts/user-repository-contract'

type FullUser = User & {
  passwordHash: string
  member_on?: { organizationId: string; role: 'MEMBER' }[] // Simula a relação many-to-many
}

export class InMemoryUserRepository implements IUserRepositoryContract {
  private items: FullUser[] = []

  public async findById(id: string): Promise<FindByIdResponse | null> {
    const user = this.items.find(item => item.id === id)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || null,
    }
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  public async create({
    name,
    email,
    password,
    organization,
  }: ICreateUser): Promise<User> {
    const newUser: FullUser = {
      id: randomUUID(),
      name: name ?? '',
      email: email,
      passwordHash: password ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatarUrl: '',
      member_on: organization
        ? [{ organizationId: organization.id, role: 'MEMBER' }]
        : [],
    }

    this.items.push(newUser)

    return newUser
  }

  public async update({ userId, data }: IUpdateUser): Promise<User | null> {
    const userIndex = this.items.findIndex(user => user.id === userId)

    if (userIndex === -1) {
      return null
    }

    const existingUser = this.items[userIndex]

    const updatedUser: FullUser = {
      ...existingUser,
      ...data,
      updatedAt: new Date(),
    } as FullUser

    this.items[userIndex] = updatedUser

    return updatedUser
  }

  public getItems(): User[] {
    return this.items
  }

  public setItems(items: FullUser[]) {
    this.items = items
  }
}

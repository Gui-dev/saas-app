import { randomUUID } from 'crypto'

import { User } from '@/generated/prisma'
import {
  FindByIdResponse,
  ICreateUser,
  IUpdateUser,
  IUserRepositoryContract,
} from '../../contracts/user-repository-contract'

export class InMemoryUserRepository implements IUserRepositoryContract {
  private items: User[] = []

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
    const newUser: User = {
      id: randomUUID(),
      name,
      email,
      passwordHash: password,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(newUser)

    return newUser
  }

  public async update({ userId, data }: IUpdateUser): Promise<User | null> {
    const userIndex = this.items.findIndex(user => user.id === userId)

    if (!userIndex) {
      null
    }

    const existingUser = this.items[userIndex]

    const updatedUser: User = {
      ...existingUser,
      ...data,
    }
    this.items[userIndex] = updatedUser

    return updatedUser
  }

  public getItems(): User[] {
    return this.items
  }

  public setItems(items: User[]) {
    this.items = items
  }
}

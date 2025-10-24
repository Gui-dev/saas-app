import { Project } from '@/generated/prisma'

export interface ICreateProject {
  userId: string
  organizationId: string
  name: string
  description: string
  slug: string
}

export interface IProjectRepositoryContract {
  create(data: ICreateProject): Promise<Project>
}

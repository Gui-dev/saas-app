import { Project } from '@/generated/prisma'
import {
  ICreateProject,
  IProjectRepositoryContract,
} from '../contracts/project-repository-contract'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

export class ProjectRepository implements IProjectRepositoryContract {
  public async create({
    userId,
    organizationId,
    name,
    description,
    slug,
  }: ICreateProject): Promise<Project> {
    const project = await prisma.project.create({
      data: {
        ownerId: userId,
        organizationId,
        name,
        description,
        slug: createSlug(slug),
      },
    })

    return project
  }
}

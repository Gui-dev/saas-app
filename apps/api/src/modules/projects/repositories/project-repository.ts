import { Project } from '@/generated/prisma'
import {
  ICreateProject,
  IDeleteProject,
  IFindAllProjectsByOrganizationIdResponse,
  IFindByProjectIdAndOrganizationId,
  IFindByProjectSlugAndOrganizationId,
  IGetProjectBySlugAndOrganizationIdResponse,
  IProjectRepositoryContract,
} from '../contracts/project-repository-contract'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

export class ProjectRepository implements IProjectRepositoryContract {
  public async findByProjectIdAndOrganizationId({
    projectId,
    organizationId,
  }: IFindByProjectIdAndOrganizationId): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        organizationId,
      },
    })

    return project
  }

  public async findByProjectSlugAndOrganizationId({
    projectSlug,
    organizationId,
  }: IFindByProjectSlugAndOrganizationId): Promise<IGetProjectBySlugAndOrganizationIdResponse | null> {
    const project = await prisma.project.findUnique({
      where: {
        slug: projectSlug,
        organizationId,
      },
      select: {
        id: true,
        ownerId: true,
        organizationId: true,
        name: true,
        description: true,
        slug: true,
        avatarUrl: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    return project
  }

  public async findAllProjectsByOrganizationId(
    organizationId: string
  ): Promise<IFindAllProjectsByOrganizationIdResponse[]> {
    const projects = await prisma.project.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        ownerId: true,
        organizationId: true,
        name: true,
        description: true,
        slug: true,
        avatarUrl: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    })

    return projects
  }

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

  public async delete({ projectId, ownerId }: IDeleteProject): Promise<void> {
    await prisma.project.delete({
      where: {
        id: projectId,
        ownerId,
      },
    })
  }
}

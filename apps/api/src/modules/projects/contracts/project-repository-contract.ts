import { Prisma, Project } from '@/generated/prisma'

export interface IFindByProjectIdAndOrganizationId {
  projectId: string
  organizationId: string
}

export interface IFindByProjectSlugAndOrganizationId {
  projectSlug: string
  organizationId: string
}

export type IGetProjectBySlugAndOrganizationIdResponse =
  Prisma.ProjectGetPayload<{
    select: {
      id: true
      ownerId: true
      organizationId: true
      name: true
      description: true
      slug: true
      avatarUrl: true
      owner: {
        select: {
          id: true
          name: true
          avatarUrl: true
        }
      }
    }
  }>

export type IFindAllProjectsByOrganizationIdResponse =
  Prisma.ProjectGetPayload<{
    select: {
      id: true
      ownerId: true
      organizationId: true
      name: true
      description: true
      slug: true
      avatarUrl: true
      createdAt: true
      owner: {
        select: {
          id: true
          name: true
          avatarUrl: true
        }
      }
    }
  }>

export interface ICreateProject {
  userId: string
  organizationId: string
  name: string
  description: string
  slug: string
}

export interface IDeleteProject {
  ownerId: string
  projectId: string
}

export interface IUpdateProject {
  projectId: string
  ownerId: string
  data: Partial<Omit<Project, 'id' | 'organizationId' | 'slug'>>
}

export interface IProjectRepositoryContract {
  findByProjectIdAndOrganizationId(
    data: IFindByProjectIdAndOrganizationId
  ): Promise<Project | null>
  findByProjectSlugAndOrganizationId(
    data: IFindByProjectSlugAndOrganizationId
  ): Promise<IGetProjectBySlugAndOrganizationIdResponse | null>
  findAllProjectsByOrganizationId(
    organizationId: string
  ): Promise<IFindAllProjectsByOrganizationIdResponse[]>
  create(data: ICreateProject): Promise<Project>
  delete(data: IDeleteProject): Promise<void>
  update(data: IUpdateProject): Promise<Project>
}

import { randomUUID } from 'node:crypto'

import type { Project } from '@/generated/prisma'
import type {
  ICreateProject,
  IDeleteProject,
  IFindAllProjectsByOrganizationIdResponse,
  IFindByProjectIdAndOrganizationId,
  IFindByProjectSlugAndOrganizationId,
  IGetProjectBySlugAndOrganizationIdResponse,
  IProjectRepositoryContract,
  IUpdateProject,
} from '../../contracts/project-repository-contract'

export class InMemoryProjectRepository implements IProjectRepositoryContract {
  private items: Project[] = []

  public async findByProjectIdAndOrganizationId({
    projectId,
    organizationId,
  }: IFindByProjectIdAndOrganizationId): Promise<Project | null> {
    const project = this.items.find(
      item => item.id === projectId && item.organizationId === organizationId
    )

    if (!project) {
      return null
    }

    return project
  }

  public async findByProjectSlugAndOrganizationId({
    projectSlug,
    organizationId,
  }: IFindByProjectSlugAndOrganizationId): Promise<IGetProjectBySlugAndOrganizationIdResponse | null> {
    const project = this.items.find(
      item =>
        item.slug === projectSlug && item.organizationId === organizationId
    )

    if (!project) {
      return null
    }

    return {
      id: project.id,
      ownerId: project.ownerId,
      organizationId: project.organizationId,
      name: project.name,
      description: project.description,
      slug: project.slug,
      avatarUrl: project.avatarUrl,
      owner: {
        id: project.ownerId,
        name: '',
        avatarUrl: null,
      },
    }
  }

  public async findAllProjectsByOrganizationId(
    organizationId: string
  ): Promise<IFindAllProjectsByOrganizationIdResponse[]> {
    const projects = this.items.filter(
      item => item.organizationId === organizationId
    )

    return projects.map(project => ({
      id: project.id,
      ownerId: project.ownerId,
      organizationId: project.organizationId,
      name: project.name,
      description: project.description,
      slug: project.slug,
      avatarUrl: project.avatarUrl,
      createdAt: project.createdAt,
      owner: {
        id: project.ownerId,
        name: '',
        avatarUrl: null,
      },
    }))
  }

  public async create({
    userId,
    organizationId,
    name,
    description,
  }: ICreateProject): Promise<Project> {
    const slug = name.toLowerCase().replace(/\s+/g, '-')

    const newProject: Project = {
      id: randomUUID(),
      ownerId: userId,
      organizationId,
      name,
      description,
      slug: `${slug}-${randomUUID().slice(0, 8)}`,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(newProject)

    return newProject
  }

  public async delete({ projectId, ownerId }: IDeleteProject): Promise<void> {
    const projectIndex = this.items.findIndex(
      item => item.id === projectId && item.ownerId === ownerId
    )

    if (projectIndex !== -1) {
      this.items.splice(projectIndex, 1)
    }
  }

  public async update({ projectId, data }: IUpdateProject): Promise<Project> {
    const projectIndex = this.items.findIndex(item => item.id === projectId)

    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    const existingProject = this.items[projectIndex]

    const updatedProject: Project = {
      ...existingProject,
      ...data,
      updatedAt: new Date(),
    }

    this.items[projectIndex] = updatedProject

    return updatedProject
  }

  public async count(organizationId: string): Promise<number> {
    return this.items.filter(item => item.organizationId === organizationId)
      .length
  }

  public setItems(items: Project[]) {
    this.items = items
  }

  public getItems(): Project[] {
    return this.items
  }
}

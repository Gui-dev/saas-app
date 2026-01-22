import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Project } from '@/generated/prisma'
import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository'
import { GetProjectByIdAndOrganizationIdUseCase } from './get-project-by-id-and-organization-id'

describe('GetProjectByIdAndOrganizationIdUseCase', () => {
  let projectRepository: InMemoryProjectRepository
  let sut: GetProjectByIdAndOrganizationIdUseCase

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    sut = new GetProjectByIdAndOrganizationIdUseCase(projectRepository)
  })

  it('should return a project when it exists', async () => {
    const organizationId = randomUUID()
    const projectId = randomUUID()
    const ownerId = randomUUID()

    const createdProject: Project = {
      id: projectId,
      ownerId,
      organizationId,
      name: 'Test Project',
      description: 'Test Description',
      slug: 'test-project',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projectRepository.setItems(createdProject)

    const result = await sut.execute({
      projectId,
      organizationId,
    })

    expect(result.project).toEqual(createdProject)
  })

  it('should throw BadRequestError when project does not exist', async () => {
    const organizationId = randomUUID()
    const projectId = randomUUID()

    await expect(
      sut.execute({
        projectId,
        organizationId,
      })
    ).rejects.toThrow('Project not found')
  })

  it('should throw BadRequestError when project belongs to different organization', async () => {
    const organizationId = randomUUID()
    const differentOrganizationId = randomUUID()
    const projectId = randomUUID()
    const ownerId = randomUUID()

    const createdProject: Project = {
      id: projectId,
      ownerId,
      organizationId,
      name: 'Test Project',
      description: 'Test Description',
      slug: 'test-project',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    projectRepository.setItems(createdProject)

    await expect(
      sut.execute({
        projectId,
        organizationId: differentOrganizationId,
      })
    ).rejects.toThrow('Project not found')
  })
})

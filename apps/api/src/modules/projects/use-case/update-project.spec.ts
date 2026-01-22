import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Project } from '@/generated/prisma'

import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository'
import { UpdateProjectUseCase } from './update-project'

describe('UpdateProjectUseCase', () => {
  let projectRepository: InMemoryProjectRepository
  let sut: UpdateProjectUseCase

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    sut = new UpdateProjectUseCase(projectRepository)
  })

  it('should update a project successfully', async () => {
    const projectId = randomUUID()
    const ownerId = randomUUID()
    const organizationId = randomUUID()

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
      userId: ownerId,
      projectId,
      name: 'Updated Name',
      description: 'Updated Description',
    })

    expect(result.projectId).toBe(projectId)

    const updatedProject = projectRepository.getItems()[0]
    expect(updatedProject.name).toBe('Updated Name')
    expect(updatedProject.description).toBe('Updated Description')
  })

  it('should throw BadRequestError when project does not exist', async () => {
    const userId = randomUUID()
    const projectId = randomUUID()

    await expect(
      sut.execute({
        userId,
        projectId,
        name: 'Updated Name',
        description: 'Updated Description',
      })
    ).rejects.toThrow('Project not found')
  })

  it('should update project even when userId is different (repository handles authorization)', async () => {
    const projectId = randomUUID()
    const ownerId = randomUUID()
    const differentUserId = randomUUID()
    const organizationId = randomUUID()

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
      userId: differentUserId,
      projectId,
      name: 'Updated Name',
      description: 'Updated Description',
    })

    expect(result.projectId).toBe(projectId)

    const updatedProject = projectRepository.getItems()[0]
    expect(updatedProject.name).toBe('Updated Name')
    expect(updatedProject.description).toBe('Updated Description')
  })
})

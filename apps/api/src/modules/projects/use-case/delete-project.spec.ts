import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Project } from '@/generated/prisma'

import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository'
import { DeleteProjectUseCase } from './delete-project'

describe('DeleteProjectUseCase', () => {
  let projectRepository: InMemoryProjectRepository
  let sut: DeleteProjectUseCase

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    sut = new DeleteProjectUseCase(projectRepository)
  })

  it('should delete a project successfully', async () => {
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

    await sut.execute({ projectId, ownerId })

    expect(projectRepository.getItems()).toHaveLength(0)
  })

  it('should not throw error when project does not exist', async () => {
    const projectId = randomUUID()
    const ownerId = randomUUID()

    await expect(sut.execute({ projectId, ownerId })).resolves.not.toThrow()
  })

  it('should delete project even with different ownerId passed (repository handles authorization)', async () => {
    const projectId = randomUUID()
    const ownerId = randomUUID()
    const differentOwnerId = randomUUID()
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

    await sut.execute({ projectId, ownerId: differentOwnerId })

    expect(projectRepository.getItems()).toHaveLength(0)
  })
})

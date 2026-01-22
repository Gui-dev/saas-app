import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository'
import { CreateProjectUseCase } from './create-project'

describe('CreateProjectUseCase', () => {
  let inMemoryProjectRepository: InMemoryProjectRepository
  let sut: CreateProjectUseCase

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new CreateProjectUseCase(inMemoryProjectRepository)
  })

  it('should create a project successfully', async () => {
    const userId = 'user-123'
    const organizationId = 'org-456'
    const name = 'My Project'
    const description = 'Project description'

    const result = await sut.execute({
      userId,
      organizationId,
      name,
      description,
    })

    expect(result.projectId).toBeDefined()

    const project = inMemoryProjectRepository.getItems()[0]
    expect(project.name).toBe(name)
    expect(project.description).toBe(description)
    expect(project.ownerId).toBe(userId)
    expect(project.organizationId).toBe(organizationId)
  })

  it('should throw BadRequestError when project creation returns null', async () => {
    const originalCreate = inMemoryProjectRepository.create
    inMemoryProjectRepository.create = vi.fn().mockResolvedValue(null)

    await expect(
      sut.execute({
        userId: 'user-123',
        organizationId: 'org-456',
        name: 'Test Project',
        description: 'Description',
      })
    ).rejects.toThrow('Error creating project')

    inMemoryProjectRepository.create = originalCreate
  })

  it('should create multiple projects with different slugs', async () => {
    await sut.execute({
      userId: 'user-123',
      organizationId: 'org-456',
      name: 'My Project',
      description: 'First project',
    })

    await sut.execute({
      userId: 'user-123',
      organizationId: 'org-456',
      name: 'My Project',
      description: 'Second project',
    })

    const projects = inMemoryProjectRepository.getItems()
    expect(projects).toHaveLength(2)
    expect(projects[0].slug).not.toBe(projects[1].slug)
  })
})

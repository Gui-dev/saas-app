import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository'
import { GetProjectsUseCase } from './get-projects'

describe('GetProjectsUseCase', () => {
  let inMemoryProjectRepository: InMemoryProjectRepository
  let sut: GetProjectsUseCase

  beforeEach(() => {
    inMemoryProjectRepository = new InMemoryProjectRepository()
    sut = new GetProjectsUseCase(inMemoryProjectRepository)
  })

  it('should return empty array when no projects exist for the organization', async () => {
    const organizationId = 'org-123'

    const result = await sut.execute({ organizationId })

    expect(result.projects).toEqual([])
  })

  it('should return projects for a valid organization', async () => {
    const organizationId = 'org-456'

    await inMemoryProjectRepository.create({
      userId: 'user-1',
      organizationId,
      name: 'Project 1',
      description: 'Description 1',
    })

    await inMemoryProjectRepository.create({
      userId: 'user-1',
      organizationId,
      name: 'Project 2',
      description: 'Description 2',
    })

    const result = await sut.execute({ organizationId })

    expect(result.projects).toHaveLength(2)
    expect(result.projects[0].name).toBe('Project 1')
    expect(result.projects[1].name).toBe('Project 2')
  })

  it('should only return projects from the requested organization', async () => {
    const organizationId1 = 'org-1'
    const organizationId2 = 'org-2'

    await inMemoryProjectRepository.create({
      userId: 'user-1',
      organizationId: organizationId1,
      name: 'Project Org 1',
      description: 'Description',
    })

    await inMemoryProjectRepository.create({
      userId: 'user-1',
      organizationId: organizationId2,
      name: 'Project Org 2',
      description: 'Description',
    })

    const result1 = await sut.execute({ organizationId: organizationId1 })
    const result2 = await sut.execute({ organizationId: organizationId2 })

    expect(result1.projects).toHaveLength(1)
    expect(result1.projects[0].name).toBe('Project Org 1')
    expect(result2.projects).toHaveLength(1)
    expect(result2.projects[0].name).toBe('Project Org 2')
  })
})

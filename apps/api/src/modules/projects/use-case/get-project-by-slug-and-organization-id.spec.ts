import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryProjectRepository } from '../repositories/in-memory/in-memory-project-repository'
import { GetProjectBySlugAndOrganizationIdUseCase } from './get-project-by-slug-and-organization-id'

describe('GetProjectBySlugAndOrganizationIdUseCase', () => {
  let projectRepository: InMemoryProjectRepository
  let sut: GetProjectBySlugAndOrganizationIdUseCase

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    sut = new GetProjectBySlugAndOrganizationIdUseCase(projectRepository)
  })

  it('should return a project when it exists', async () => {
    const organizationId = randomUUID()
    const ownerId = randomUUID()

    const createdProject = await projectRepository.create({
      userId: ownerId,
      organizationId,
      name: 'Test Project',
      description: 'Test Description',
    })

    const result = await sut.execute({
      projectSlug: createdProject.slug,
      organizationId,
    })

    expect(result.project).toBeDefined()
    expect(result.project.id).toBe(createdProject.id)
    expect(result.project.name).toBe('Test Project')
  })

  it('should throw BadRequestError when project does not exist', async () => {
    const organizationId = randomUUID()
    const projectSlug = 'non-existent-project'

    await expect(
      sut.execute({
        projectSlug,
        organizationId,
      })
    ).rejects.toThrow('Project not found')
  })

  it('should throw BadRequestError when project belongs to different organization', async () => {
    const organizationId = randomUUID()
    const differentOrganizationId = randomUUID()
    const ownerId = randomUUID()

    const createdProject = await projectRepository.create({
      userId: ownerId,
      organizationId,
      name: 'Test Project',
      description: 'Test Description',
    })

    await expect(
      sut.execute({
        projectSlug: createdProject.slug,
        organizationId: differentOrganizationId,
      })
    ).rejects.toThrow('Project not found')
  })

  it('should return project with owner information', async () => {
    const organizationId = randomUUID()
    const ownerId = randomUUID()

    const createdProject = await projectRepository.create({
      userId: ownerId,
      organizationId,
      name: 'Test Project',
      description: 'Test Description',
    })

    const result = await sut.execute({
      projectSlug: createdProject.slug,
      organizationId,
    })

    expect(result.project.owner).toBeDefined()
    expect(result.project.owner.id).toBe(ownerId)
  })
})

import { api } from './api-client'

export interface IGetProjectsResponse {
  projects: {
    id: string
    ownerId: string
    organizationId: string
    name: string
    description: string
    slug: string
    avatarUrl: string | null
    createdAt: Date
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }[]
}

export const getProjects = async (slug: string) => {
  const projects = await api
    .get(`organizations/${slug}/projects`)
    .json<IGetProjectsResponse>()

  return projects
}

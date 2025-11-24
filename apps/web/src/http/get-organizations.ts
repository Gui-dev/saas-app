import { api } from './api-client'

export interface IGetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export const getOrganizations =
  async (): Promise<IGetOrganizationsResponse> => {
    const organizations = await api
      .get('organizations')
      .json<IGetOrganizationsResponse>()

    return organizations
  }

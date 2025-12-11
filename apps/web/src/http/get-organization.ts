import { api } from './api-client'

export interface IGetOrganizationRequest {
  org: string
}

export interface IGetOrganizationResponse {
  organization: {
    id: string
    ownerId: string
    name: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
  }
}

export const getOrganization = async ({
  org,
}: IGetOrganizationRequest): Promise<IGetOrganizationResponse> => {
  const organization = await api
    .get(`organizations/${org}`)
    .json<IGetOrganizationResponse>()

  return organization
}

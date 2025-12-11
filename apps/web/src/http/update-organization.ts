import { api } from './api-client'

export interface IUpdateOrganizationRequest {
  org: string
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export interface IUpdateOrganizationResponse {
  id: string
}

export const updateOrganization = async ({
  org,
  name,
  domain,
  shouldAttachUsersByDomain,
}: IUpdateOrganizationRequest): Promise<IUpdateOrganizationResponse> => {
  const result = await api
    .put(`organizations/${org}`, {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<IUpdateOrganizationResponse>()

  return result
}

import { api } from './api-client'

export interface ICreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

export interface ICreateOrganizationResponse {
  id: string
}

export const createOrganization = async ({
  name,
  domain,
  shouldAttachUsersByDomain,
}: ICreateOrganizationRequest): Promise<ICreateOrganizationResponse> => {
  const result = await api
    .post('organizations', {
      json: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })
    .json<ICreateOrganizationResponse>()

  return result
}

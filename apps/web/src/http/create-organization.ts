import { api } from './api-client'

export interface ICreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttchUsersByDomain: boolean
}

export interface ICreateOrganizationResponse {
  id: string
}

export const createOrganization = async ({
  name,
  domain,
  shouldAttchUsersByDomain,
}: ICreateOrganizationRequest): Promise<ICreateOrganizationResponse> => {
  const result = await api
    .post('organizations', {
      json: {
        name,
        domain,
        shouldAttchUsersByDomain,
      },
    })
    .json<ICreateOrganizationResponse>()

  return result
}

import { api } from './api-client'

export interface IShutdownOrganizationRequest {
  org: string
}

export const shutdownOrganization = async ({
  org,
}: IShutdownOrganizationRequest): Promise<void> => {
  await api.delete(`organizations/${org}`)
}

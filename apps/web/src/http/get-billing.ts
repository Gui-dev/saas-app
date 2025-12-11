import { api } from './api-client'

export interface IGetBillingRequest {
  org: string
}

export interface IGetBillingResponse {
  billing: {
    seats: {
      amount: number
      unit: number
      price: number
    }
    projects: {
      amount: number
      unit: number
      price: number
    }
    total: number
  }
}

export const getBilling = async ({
  org,
}: IGetBillingRequest): Promise<IGetBillingResponse> => {
  const billing = await api
    .get(`organizations/${org}/billing`)
    .json<IGetBillingResponse>()

  return billing
}

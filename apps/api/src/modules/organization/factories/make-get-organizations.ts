import { OrganizationRepository } from '../repositories/organization-repository'
import {
  GetOrganizationsUseCase,
  type IGetOrganizationsUseCaseRequest,
} from '../use-cases/get-organizations'

export const makeGetOrganizations = async ({
  userId,
}: IGetOrganizationsUseCaseRequest) => {
  const organizationRepository = new OrganizationRepository()
  const getOrganizationsUseCase = new GetOrganizationsUseCase(
    organizationRepository
  )

  const { organizations } = await getOrganizationsUseCase.execute({ userId })

  return {
    organizations,
  }
}

import { OrganizationRepository } from '../repositories/organization-repository'
import {
  type IUpdateOrganizationUseCaseRequest,
  UpdateOrganizationUseCase,
} from '../use-cases/update-organization'

export const makeUpdateOrganization = async ({
  domain,
  organizationId,
  name,
  shouldAttachUsersByDomain,
}: IUpdateOrganizationUseCaseRequest) => {
  const organizationRepository = new OrganizationRepository()
  const updateOrganizationUseCase = new UpdateOrganizationUseCase(
    organizationRepository
  )
  await updateOrganizationUseCase.execute({
    domain,
    organizationId,
    name,
    shouldAttachUsersByDomain,
  })
}

import { OrganizationRepository } from '../repositories/organization-repository'
import {
  CreateOrganizationUseCase,
  ICreateOrganizationUseCaseRequest,
} from '../use-cases/create-organization'

export const makeCreateOrganization = async ({
  ownerId,
  name,
  domain,
  shouldAttachUsersByDomain,
}: ICreateOrganizationUseCaseRequest) => {
  const organizationRepository = new OrganizationRepository()
  const createOrganizationUseCase = new CreateOrganizationUseCase(
    organizationRepository
  )

  const { organizationId } = await createOrganizationUseCase.execute({
    ownerId,
    name,
    domain,
    shouldAttachUsersByDomain,
  })

  return {
    organizationId,
  }
}

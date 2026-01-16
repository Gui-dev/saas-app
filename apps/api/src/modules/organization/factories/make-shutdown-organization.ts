import { OrganizationRepository } from '../repositories/organization-repository'
import {
  type IShutdownOrganizationUseCaseRequest,
  ShutdownOrganizationUseCase,
} from '../use-cases/shutdown-organization'

export const makeShutdownOrganization = async ({
  organizationId,
}: IShutdownOrganizationUseCaseRequest) => {
  const organizationRepository = new OrganizationRepository()
  const shutdownOrganizationUseCase = new ShutdownOrganizationUseCase(
    organizationRepository
  )
  await shutdownOrganizationUseCase.execute({ organizationId })
}

import { MemberRepository } from '@/modules/members/repositories/member-repository'
import { ProjectRepository } from '@/modules/projects/repositories/project-repository'
import {
  GetOrganizationBillingUseCase,
  type IGetOrganizationBillingUseCaseRequest,
} from '../use-cases/get-organization-billing'

export const makeGetOrganizationBilling = async ({
  organizationId,
}: IGetOrganizationBillingUseCaseRequest) => {
  const memberRepository = new MemberRepository()
  const projectRepository = new ProjectRepository()
  const getOrganizationBillingUseCase = new GetOrganizationBillingUseCase(
    memberRepository,
    projectRepository
  )

  const { billing } = await getOrganizationBillingUseCase.execute({
    organizationId,
  })

  return {
    billing,
  }
}

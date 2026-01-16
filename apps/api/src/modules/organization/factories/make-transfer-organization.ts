import { MemberRepository } from '@/modules/members/repositories/member-repository'
import { OrganizationRepository } from '../repositories/organization-repository'
import {
  type ITransferOrganizationUseCaseRequest,
  TransferOrganizationUseCase,
} from '../use-cases/transfer-organization'

export const makeTransferOrganization = async ({
  organizationId,
  transferToUserId,
}: ITransferOrganizationUseCaseRequest): Promise<void> => {
  const organizationRepository = new OrganizationRepository()
  const memberRepository = new MemberRepository()
  const transferOrganizationUseCase = new TransferOrganizationUseCase(
    organizationRepository,
    memberRepository
  )
  await transferOrganizationUseCase.execute({
    organizationId,
    transferToUserId,
  })
}

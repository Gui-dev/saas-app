import { BadRequestError } from '@/http/_errors/bad-request-error'
import type { IMemberRepositoryContract } from '@/modules/members/contracts/member-repository-contract'
import type { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'

export interface ITransferOrganizationUseCaseRequest {
  organizationId: string
  transferToUserId: string
}

export class TransferOrganizationUseCase {
  constructor(
    private organizationRepository: IOrganizationRepositoryContract,
    private memberRepository: IMemberRepositoryContract
  ) {}

  public async execute({
    organizationId,
    transferToUserId,
  }: ITransferOrganizationUseCaseRequest) {
    const transferToMembership =
      await this.memberRepository.findByOrganizationIdAndUserId({
        organizationId,
        userId: transferToUserId,
      })

    if (!transferToMembership) {
      throw new BadRequestError(
        'Target user is not a member of this organization'
      )
    }

    await this.memberRepository.updateByUserId({
      organizationId,
      userId: transferToUserId,
      data: {
        role: 'ADMIN',
      },
    })

    await this.organizationRepository.update({
      organizationId,
      data: {
        ownerId: transferToUserId,
      },
    })
  }
}

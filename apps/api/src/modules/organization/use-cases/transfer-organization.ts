import { IMemberRepositoryContract } from '@/modules/members/contracts/member-repository-contract'
import { IOrganizationRepositoryContract } from '../contracts/organization-repository-contract'
import { BadRequestError } from '@/http/_errors/bad-request-error'

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

    await this.memberRepository.update({
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

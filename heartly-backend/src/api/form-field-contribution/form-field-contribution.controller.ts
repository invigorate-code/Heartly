import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { FormFieldContributionEntity } from '../../common/entities/form-field-contribution.entity';
import { FormFieldContributionService } from '../../common/services/form-field-contribution.service';

@Controller('form-field-contributions')
@ApiTags('form-field-contributions')
@ApiBearerAuth()
@UseGuards(SuperTokensAuthGuard)
export class FormFieldContributionController {
  constructor(
    private readonly formFieldContributionService: FormFieldContributionService,
  ) {}

  @Get('entity/:formType/:entityId')
  async getByFormEntity(
    @Param('formType') formType: string,
  ): Promise<FormFieldContributionEntity[]> {
    return this.formFieldContributionService.getFieldContributions(formType);
  }

  // @Get('contributor/:id')
  // async getByContributor(
  //   @Param('id') contributorId: string,
  // ): Promise<FormFieldContributionEntity[]> {
  //   return this.formFieldContributionService.getFieldContributionsByContributor(
  //     contributorId,
  //   );
  // }

  // @Get('field')
  // async getFieldContribution(
  //   @Query('formType') formType: string,
  //   @Query('entityId') entityId: string,
  //   @Query('fieldName') fieldName: string,
  // ): Promise<FormFieldContributionEntity | null> {
  //   return this.formFieldContributionService.getFieldContributions(
  //     formType,
  //     entityId,
  //     fieldName,
  //   );
  // }

  // @Get('summary/:formType/:entityId')
  // async getContributorSummary(
  //   @Param('formType') formType: string,
  //   @Param('entityId') entityId: string,
  // ) {
  //   return this.formFieldContributionService.getContributorSummary(
  //     formType,
  //     entityId,
  //   );
  // }
}

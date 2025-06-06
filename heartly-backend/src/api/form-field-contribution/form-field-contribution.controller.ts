import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';
import { FormFieldContributionEntity } from './entities/form-field-contribution.entity';
import { FormFieldContributionService } from './form-field-contribution.service';

@Controller('form-field-contributions')
@ApiTags('form-field-contributions')
@ApiBearerAuth()
@UseGuards(SuperTokensAuthGuard)
export class FormFieldContributionController {
  constructor(
    private readonly formFieldContributionService: FormFieldContributionService,
  ) {}

  @Post()
  async trackContribution(
    @Body()
    contributionData: {
      fieldName: string;
      contributorId: string;
      placementInfoId: string;
    },
  ): Promise<FormFieldContributionEntity> {
    return this.formFieldContributionService.trackFieldContribution(
      contributionData.fieldName,
      contributionData.contributorId,
      contributionData.placementInfoId,
    );
  }

  @Get('placement/:id')
  async getByPlacementInfo(
    @Param('id') placementInfoId: string,
  ): Promise<FormFieldContributionEntity[]> {
    return this.formFieldContributionService.getFieldContributionsByPlacementInfo(
      placementInfoId,
    );
  }

  @Get('contributor/:id')
  async getByContributor(
    @Param('id') contributorId: string,
  ): Promise<FormFieldContributionEntity[]> {
    return this.formFieldContributionService.getFieldContributionsByContributor(
      contributorId,
    );
  }

  @Get('field')
  async getFieldContribution(
    @Query('placementInfoId') placementInfoId: string,
    @Query('fieldName') fieldName: string,
  ): Promise<FormFieldContributionEntity | null> {
    return this.formFieldContributionService.getFieldContribution(
      placementInfoId,
      fieldName,
    );
  }
}
